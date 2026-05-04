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
import vn.edu.nlu.fit.auction.entity.Wallet;
import vn.edu.nlu.fit.auction.enums.AuthProvider;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.repository.Auth.UserRepository;
import vn.edu.nlu.fit.auction.repository.Profile.ProfileRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletRepository;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository; // 🔥 THÊM
    private final WalletRepository walletRepository;
    private final JwtService jwtService;

    @Override
    // Phương thức này sẽ được gọi khi người dùng đăng nhập thành công qua OAuth2
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
                                        throws IOException {

        // B1: Lấy thông tin người dùng từ authentication object
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        // B2: Kiểm tra nếu user đã tồn tại trong database chưa
        // Nếu chưa có thì tạo mới user với role USER và provider = GOOGLE
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

            // tạo profile mặc định cho user mới
            Profile profile = new Profile();
            profile.setUser(user);
            profile.setFullName(name);

            // lưu profile vào dabasate
            profileRepository.save(profile);
        }
        
        // B3: Đảm bảo mỗi user có một wallet, nếu chưa có thì tạo mới
        ensureWalletExists(user);

        // B4: Tạo JWT token từ user và trả về cho FE qua URL redirect
        String token = jwtService.generateToken(user);

        // FE sẽ nhận token này và lưu vào localStorage để dùng cho các request sau
        String redirectUrl = "http://localhost:5173/oauth2/success?token=" + token;

        // B5: Redirect người dùng về FE với token trong URL
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    // Phương thức đảm bảo mỗi user có một wallet, nếu chưa có thì tạo mới
    private void ensureWalletExists(User user) {
        if (walletRepository.findByUserId(user.getUserId()).isPresent()) {
            return;
        }

        Wallet wallet = new Wallet();
        wallet.setUserId(user.getUserId());
        walletRepository.save(wallet);
    }
}