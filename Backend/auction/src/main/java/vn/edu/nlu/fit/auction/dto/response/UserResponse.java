package vn.edu.nlu.fit.auction.dto.response;

import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.enums.AuthProvider;

public class UserResponse {
    private Integer id;
    private String username;
    private String email;
    private UserStatus status;
    private UserRole role;
    private AuthProvider provider;

    public UserResponse(Integer id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public UserResponse(Integer id, String username, String email, UserStatus status, UserRole role, AuthProvider provider) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.status = status;
        this.role = role;
        this.provider = provider;
    }

    public Integer getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public UserStatus getStatus() { return status; }
    public UserRole getRole() { return role; }
    public AuthProvider getProvider() { return provider; }
}
