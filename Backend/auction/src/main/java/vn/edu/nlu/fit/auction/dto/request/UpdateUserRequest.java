package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;

@Data
public class UpdateUserRequest {
    
    private UserRole role;
    private UserStatus status
    ;
}
