package vn.edu.nlu.fit.auction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.nlu.fit.auction.dto.request.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterRequest;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // REGISTER
    public String register(RegisterRequest request){

        if(userRepository.existsByEmail(request.getEmail())){
            return "Email already exists";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // hash password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        return "Register success";
    }

    // LOGIN
    public String login(LoginRequest request){

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if(user == null){
            return "User not found";
        }

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            return "Wrong password";
        }

        if(user.getStatus() != UserStatus.ACTIVE){
            return "Account locked";
        }

        return "Login success";
    }    
}
