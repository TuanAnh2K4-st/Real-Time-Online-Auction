package vn.edu.nlu.fit.auction.mapper;

import org.springframework.stereotype.Component;
import vn.edu.nlu.fit.auction.dto.request.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterUserRequest;
import vn.edu.nlu.fit.auction.entity.User;

@Component
public class UserMapper {

    public User toRegisterUser(RegisterUserRequest req) {
        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        return user;
    }

    public User toRegisterSeller(RegisterSellerRequest req) {
        User user = new User();
        user.setUsername(req.getCompanyName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        return user;
    }
}
