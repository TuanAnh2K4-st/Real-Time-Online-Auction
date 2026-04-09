package vn.edu.nlu.fit.auction.dto.response;

import lombok.Data;

@Data
public class UserResponse {
    
    private Long id;
    private String username;
    private String email;
    private String role;
    private String status;
    
    public UserResponse(Long id, String username, String email, String role, String status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.status = status;
    }
}
