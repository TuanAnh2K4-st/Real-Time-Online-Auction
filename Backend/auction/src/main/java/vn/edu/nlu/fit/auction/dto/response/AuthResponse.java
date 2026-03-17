package vn.edu.nlu.fit.auction.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import vn.edu.nlu.fit.auction.entity.User;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private User user;
}
