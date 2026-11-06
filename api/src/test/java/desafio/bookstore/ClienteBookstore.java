package desafio.bookstore;

import io.restassured.config.HttpClientConfig;
import io.restassured.config.RestAssuredConfig;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;

public class ClienteBookstore {

    private final String baseUrl;

    public ClienteBookstore(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public Response criarUsuario(String userName, String senha) {
        return pedido()
                .body(Map.of("userName", userName, "password", senha))
                .when()
                .post("/Account/v1/User");
    }

    public Response gerarToken(String userName, String senha) {
        return pedido()
                .body(Map.of("userName", userName, "password", senha))
                .when()
                .post("/Account/v1/GenerateToken");
    }

    public Response autorizado(String userName, String senha) {
        return pedido()
                .body(Map.of("userName", userName, "password", senha))
                .when()
                .post("/Account/v1/Authorized");
    }

    public Response listarLivros() {
        return pedido()
                .when()
                .get("/BookStore/v1/Books");
    }

    public Response reservarLivros(String userId, String token, List<String> isbns) {
        List<Map<String, String>> colecao = new ArrayList<>();
        for (String isbn : isbns) {
            colecao.add(Map.of("isbn", isbn));
        }
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("userId", userId);
        corpo.put("collectionOfIsbns", colecao);

        return pedido()
                .header("Authorization", "Bearer " + token)
                .body(corpo)
                .when()
                .post("/BookStore/v1/Books");
    }

    public Response detalheUsuario(String userId, String token) {
        return pedido()
                .header("Authorization", "Bearer " + token)
                .when()
                .get("/Account/v1/User/{userId}", userId);
    }

    private RequestSpecification pedido() {
        return given()
                .config(RestAssuredConfig.config().httpClient(HttpClientConfig.httpClientConfig()
                        .setParam("http.connection.timeout", 20000)
                        .setParam("http.socket.timeout", 20000)))
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON);
    }
}
