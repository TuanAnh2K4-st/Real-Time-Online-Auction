package vn.edu.nlu.fit.auction.dto.response.Auth;

import lombok.Data;

@Data
public class LoginResponse {

    private String token;
    private String username;
    private Integer userId;
    private String role;

    public LoginResponse(String token, String username, Integer userId, String role) {
        this.token = token;
        this.username = username;
        this.userId = userId;
        this.role = role;
    }

}