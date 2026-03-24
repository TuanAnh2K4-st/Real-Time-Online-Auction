package vn.edu.nlu.fit.auction.dto.response;

public class AuthResponse {

    private String token;
    private UserLoginResponse user;

    public AuthResponse(String token, UserLoginResponse user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public UserLoginResponse getUser() { return user; }
}