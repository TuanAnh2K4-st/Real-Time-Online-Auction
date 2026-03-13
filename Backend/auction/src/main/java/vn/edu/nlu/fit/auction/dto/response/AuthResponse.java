package vn.edu.nlu.fit.auction.dto.response;

public class AuthResponse {

    private String message;
    private String email;
    private String username;

    public AuthResponse(String message, String email, String username) {
        this.message = message;
        this.email = email;
        this.username = username;
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }
}
