package vn.edu.nlu.fit.auction.dto.request.Auth;

import lombok.Data;

@Data
public class ChangePasswordRequest {

    private String oldPassword;
    
    private String newPassword;
    
}
