package vn.edu.nlu.fit.auction.service;

import java.time.LocalDateTime;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import vn.edu.nlu.fit.auction.dto.request.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterRequest;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.enums.AuthProvider;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.repository.UserRepository;
import vn.edu.nlu.fit.auction.repository.ProfileRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

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

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);
        user.setProvider(AuthProvider.LOCAL);

        userRepository.save(user);

        // tạo profile
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setFullName(request.getUsername());
        profile.setCreatedAt(LocalDateTime.now());

        profileRepository.save(profile);

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
    
    // GOOGLE LOGIN
    public User googleLogin(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList("YOUR_GOOGLE_CLIENT_ID"))
                .build();

            GoogleIdToken idTokenObj = verifier.verify(idToken);

            if (idTokenObj != null) {

                GoogleIdToken.Payload payload = idTokenObj.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String avatar = (String) payload.get("picture");
                String providerId = payload.getSubject();

                // check user tồn tại
                User user = userRepository.findByEmail(email).orElse(null);

                if (user == null) {

                    user = new User();
                    user.setUsername(name);
                    user.setEmail(email);
                    user.setProvider(AuthProvider.GOOGLE);
                    user.setProviderId(providerId);
                    user.setRole(UserRole.USER);
                    user.setStatus(UserStatus.ACTIVE);

                    userRepository.save(user);

                    // tạo profile
                    Profile profile = new Profile();
                    profile.setUser(user);
                    profile.setFullName(name);
                    profile.setAvatarUrl(avatar);
                    profile.setCreatedAt(LocalDateTime.now());

                    profileRepository.save(profile);
                }

                return user;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
