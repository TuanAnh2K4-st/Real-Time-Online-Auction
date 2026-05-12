package vn.edu.nlu.fit.auction.service.Auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Auth.ChangePasswordRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterUserRequest;
import vn.edu.nlu.fit.auction.dto.response.Auth.LoginResponse;
import vn.edu.nlu.fit.auction.entity.Business;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.Wallet;
import vn.edu.nlu.fit.auction.enums.AuthProvider;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.mapper.Auth.UserMapper;
import vn.edu.nlu.fit.auction.repository.Auth.UserRepository;
import vn.edu.nlu.fit.auction.repository.Profile.BusinessRepository;
import vn.edu.nlu.fit.auction.repository.Profile.ProfileRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletRepository;
import vn.edu.nlu.fit.auction.security.JwtService;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final BusinessRepository businessRepository;
    private final WalletRepository walletRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final SecurityUtil securityUtil;

    // chức năng đăng ký user
    public void registerUser(RegisterUserRequest request) {

        // kiểm tra trùng lặp email và username
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // mapping request sang entity
        User user = userMapper.toRegisterUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);
        user.setProvider(AuthProvider.LOCAL);

        // lưu user vào database
        userRepository.save(user);

        // tạo ví cho user
        createWalletForUser(user);

        // tạo profile cho user
        createProfileForUser(user);

    }

    // chức năng đăng ký seller
    public void registerSeller(RegisterSellerRequest request) {

        // kiểm tra trùng lặp email và username
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // tạo user
        User user = userMapper.toRegisterSeller(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.SELLER);
        user.setStatus(UserStatus.ACTIVE);
        user.setProvider(AuthProvider.LOCAL);

        // lưu user vào database
        userRepository.save(user);

        // tạo ví cho user
        createWalletForUser(user);

        // tạo profile cho user
        createProfileForUser(user);

        // tạo business cho seller
        Business business = new Business();
        business.setUser(user);
        business.setBusinessName(request.getCompanyName());
        businessRepository.save(business);
    }

    private void createWalletForUser(User user) {
        Wallet wallet = new Wallet();
        wallet.setUserId(user.getUserId());
        walletRepository.save(wallet);
    }

    private void createProfileForUser(User user) {
        Profile profile = new Profile();
        profile.setUser(user);
        profileRepository.save(profile);
    }

    // chức năng đăng nhập
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        // kiểm tra tài khoản có bị khóa không
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }
        // kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        // tạo token cho user
        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getUserId(),
                user.getRole().name()
        );
    }

    // lấy thông tin user hiện tại (dùng sau khi OAuth2 login)
    public LoginResponse getMe() {
        User currentUser = securityUtil.getCurrentUser();

        return new LoginResponse(
                null,
                currentUser.getUsername(),
                currentUser.getUserId(),
                currentUser.getRole().name()
        );
    }

    // chức năng đổi mật khẩu
    public void changePassword( ChangePasswordRequest request) {

        // lấy user từ JWT
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        // kiểm tra mật khẩu cũ có đúng không
        if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }

        // kiểm tra mật khẩu mới không được trùng mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), currentUser.getPassword())) {
            throw new RuntimeException("Mật khẩu mới không được trùng mật khẩu cũ");
        }

        // cập nhật mật khẩu mới cho user
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // lưu user vào database
        userRepository.save(currentUser);
    }
    
}