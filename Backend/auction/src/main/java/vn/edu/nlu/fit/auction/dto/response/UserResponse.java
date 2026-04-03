package vn.edu.nlu.fit.auction.dto.response;

import lombok.Data;

@Data
public class UserResponse {
    
    private Long id;
    private String username;
    private String email;
    private String role;
    private String status;
    
}
