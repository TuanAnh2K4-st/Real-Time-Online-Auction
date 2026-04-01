package vn.edu.nlu.fit.auction.dto.response;

public class LoginResponse {
    private String token;
    private Integer userId;
    private String role;

    public LoginResponse(String token, Integer userId, String role) {
        this.token = token;
        this.userId = userId;
        this.role = role;
    }

    // Getters
    
    public String getToken() {
        return token;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

}
