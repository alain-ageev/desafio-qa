package desafio.bookstore;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FluxoBookstoreTest {

    private record Livro(String titulo, String isbn) {
    }

    // Deck: uma execução contínua com os seis passos, nesta ordem.
    // O primeiro erro encerra o fluxo. userId e token só existem depois do passo anterior
    // e ficam na sessão local. O usuário é novo a cada execução (prefixo qa + timestamp):
    // usuário repetido volta 406 e o fluxo morre no passo 1.
    @Test
    void executaOsSeisPassos() throws IOException {
        Properties props = carregarPropriedades();
        List<Livro> livros = List.of(
                new Livro("Git Pocket Guide", exigir(props, "isbn.gitPocketGuide")),
                new Livro("Speaking JavaScript", exigir(props, "isbn.speakingJavaScript")));

        SessaoUsuario sessao = new SessaoUsuario();
        sessao.setUserName("qa" + System.currentTimeMillis());
        sessao.setSenha(exigir(props, "senha"));
        sessao.setIsbns(livros.stream().map(Livro::isbn).toList());

        ClienteBookstore cliente = new ClienteBookstore(exigir(props, "baseUrl"));

        criarUsuario(cliente, sessao);
        gerarToken(cliente, sessao);
        confirmarAutorizado(cliente, sessao);
        listarLivros(cliente, livros);
        reservarLivros(cliente, sessao);
        detalharUsuario(cliente, sessao);
    }

    // Passo 1. Deck: criar o usuário em POST /Account/v1/User, sem header.
    // Passa com 201, userId preenchido e username igual ao enviado.
    private void criarUsuario(ClienteBookstore cliente, SessaoUsuario sessao) {
        Response response = cliente.criarUsuario(sessao.getUserName(), sessao.getSenha());
        assertEquals(201, response.statusCode(), () -> detalhe("criar usuário", response));

        String userId = response.jsonPath().getString("userID");
        if (userId == null || userId.isBlank()) {
            userId = response.jsonPath().getString("userId");
        }
        assertNotNull(userId, () -> detalhe("criar usuário", response));
        assertFalse(userId.isBlank(), () -> detalhe("criar usuário", response));
        assertEquals(sessao.getUserName(), response.jsonPath().getString("username"),
                () -> detalhe("criar usuário", response));
        sessao.setUserId(userId);
    }

    // Passo 2. Deck: gerar o token em POST /Account/v1/GenerateToken, sem header.
    // Passa com 200, token preenchido e status Success.
    private void gerarToken(ClienteBookstore cliente, SessaoUsuario sessao) {
        Response response = cliente.gerarToken(sessao.getUserName(), sessao.getSenha());
        assertEquals(200, response.statusCode(), () -> detalhe("gerar token", response));

        String token = response.jsonPath().getString("token");
        assertNotNull(token, () -> detalhe("gerar token", response));
        assertFalse(token.isBlank(), () -> detalhe("gerar token", response));
        assertEquals("Success", response.jsonPath().getString("status"),
                () -> detalhe("gerar token", response));
        sessao.setToken(token);
    }

    // Passo 3. Deck: confirmar que o usuário está autorizado em POST /Account/v1/Authorized, sem header.
    // Passa com 200 e corpo true.
    private void confirmarAutorizado(ClienteBookstore cliente, SessaoUsuario sessao) {
        Response response = cliente.autorizado(sessao.getUserName(), sessao.getSenha());
        assertEquals(200, response.statusCode(), () -> detalhe("autorizado", response));
        assertEquals("true", response.asString().trim(), () -> detalhe("autorizado", response));
    }

    // Passo 4. Deck: listar os livros em GET /BookStore/v1/Books.
    // Passa com 200 e os dois ISBN escolhidos presentes no catálogo.
    // Se um sumir, a execução para aqui nomeando o livro. O passo 5 não troca por outro.
    private void listarLivros(ClienteBookstore cliente, List<Livro> livros) {
        Response response = cliente.listarLivros();
        assertEquals(200, response.statusCode(), () -> detalhe("listar livros", response));

        List<String> catalogo = response.jsonPath().getList("books.isbn");
        assertNotNull(catalogo, () -> detalhe("listar livros", response));
        for (Livro livro : livros) {
            assertTrue(catalogo.contains(livro.isbn()),
                    () -> "O livro " + livro.titulo() + " não está no catálogo");
        }
    }

    // Passo 5. Deck: reservar os dois livros em POST /BookStore/v1/Books.
    // O mesmo path do passo 4; aqui é POST. Header Authorization Bearer e corpo com userId
    // e collectionOfIsbns. Passa com 201.
    private void reservarLivros(ClienteBookstore cliente, SessaoUsuario sessao) {
        Response response = cliente.reservarLivros(sessao.getUserId(), sessao.getToken(), sessao.getIsbns());
        assertEquals(201, response.statusCode(), () -> detalhe("reservar livros", response));
    }

    // Passo 6. Deck: detalhe do usuário em GET /Account/v1/User/{userId}, com o mesmo Bearer.
    // O {userID} do slide é o userId devolvido na criação.
    // Passa com 200, o mesmo username e books com exatamente esses dois ISBN.
    private void detalharUsuario(ClienteBookstore cliente, SessaoUsuario sessao) {
        Response response = cliente.detalheUsuario(sessao.getUserId(), sessao.getToken());
        assertEquals(200, response.statusCode(), () -> detalhe("detalhe do usuário", response));
        assertEquals(sessao.getUserName(), response.jsonPath().getString("username"),
                () -> detalhe("detalhe do usuário", response));

        List<String> reservados = response.jsonPath().getList("books.isbn");
        assertNotNull(reservados, () -> detalhe("detalhe do usuário", response));
        assertEquals(sessao.getIsbns().size(), reservados.size(),
                () -> detalhe("detalhe do usuário", response));
        assertEquals(new HashSet<>(sessao.getIsbns()), new HashSet<>(reservados),
                () -> detalhe("detalhe do usuário", response));
    }

    private static Properties carregarPropriedades() throws IOException {
        Properties props = new Properties();
        try (InputStream in = FluxoBookstoreTest.class.getClassLoader()
                .getResourceAsStream("bookstore.properties")) {
            if (in == null) {
                throw new IllegalStateException("bookstore.properties não encontrado");
            }
            props.load(new InputStreamReader(in, StandardCharsets.UTF_8));
        }
        return props;
    }

    private static String exigir(Properties props, String chave) {
        String valor = props.getProperty(chave);
        if (valor == null || valor.isBlank()) {
            throw new IllegalStateException("Propriedade ausente: " + chave);
        }
        return valor.trim();
    }

    private static String detalhe(String passo, Response response) {
        String corpo = response.asString();
        if (corpo.length() > 500) {
            corpo = corpo.substring(0, 500);
        }
        return passo + " devolveu " + response.statusCode() + ": " + corpo;
    }
}
