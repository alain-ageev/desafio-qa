package desafio.bookstore;

import java.util.ArrayList;
import java.util.List;

public class SessaoUsuario {

    private String userName;
    private String senha;
    private String userId;
    private String token;
    private final List<String> isbns = new ArrayList<>();

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<String> getIsbns() {
        return List.copyOf(isbns);
    }

    public void setIsbns(List<String> isbns) {
        this.isbns.clear();
        this.isbns.addAll(isbns);
    }
}
