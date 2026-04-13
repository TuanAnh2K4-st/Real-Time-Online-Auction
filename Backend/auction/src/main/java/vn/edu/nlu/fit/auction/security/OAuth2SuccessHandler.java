package vn.edu.nlu.fit.auction.security;

import java.io.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.AuthProvider;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.repository.ProfileRepository;
import vn.edu.nlu.fit.auction.repository.UserRepository;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository; // 🔥 THÊM
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
                                        throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(name);
            user.setPassword("");
            user.setRole(UserRole.USER);
            user.setStatus(UserStatus.ACTIVE);
            user.setProvider(AuthProvider.GOOGLE);
            user.setProviderId(providerId);

            userRepository.save(user);

            // 🔥 TẠO PROFILE NGAY
            Profile profile = new Profile();
            profile.setUser(user);
            profile.setFullName(name);

            profileRepository.save(profile);
        }

        String token = jwtService.generateToken(user);

        String redirectUrl = "http://localhost:5173/oauth2/success?token=" + token;

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}