package vn.edu.nlu.fit.auction.dto.request.Auth;

import lombok.Data;

@Data
public class ChangePasswordRequest {

    String oldPass;

    String newPass;
    
}
