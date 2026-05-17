package vn.edu.nlu.fit.auction.service.Auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Auth.ChangePasswordRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterUserRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.VerifyOtpRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.ResendOtpRequest;
import vn.edu.nlu.fit.auction.dto.response.Auth.LoginResponse;
import vn.edu.nlu.fit.auction.entity.Business;
import vn.edu.nlu.fit.auction.entity.OtpToken;
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

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

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
    private final EmailService emailService;

    // ===== IN-MEMORY OTP STORE =====
    // Key: email, Value: OtpToken (POJO chứa thông tin đăng ký tạm + OTP)
    private final Map<String, OtpToken> pendingRegistrations = new ConcurrentHashMap<>();

    // ===== BƯỚC 1: Nhận form đăng ký, sinh OTP, gửi email (CHƯA tạo tài khoản) =====

    /**
     * Xử lý đăng ký người dùng cá nhân.
     * Chỉ sinh OTP và gửi email, chưa tạo tài khoản trong DB.
     */
    public void preRegisterUser(RegisterUserRequest request) {
        // Kiểm tra trùng lặp email và username
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên hiển thị đã được sử dụng");
        }

        // Lưu thông tin đăng ký tạm + sinh OTP
        String otp = generateOtp();
        OtpToken token = OtpToken.builder()
                .registerType("user")
                .username(request.getUsername())
                .email(request.getEmail())
                .rawPassword(request.getPassword())
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(3))
                .build();

        pendingRegistrations.put(request.getEmail(), token);

        // Gửi email OTP
        emailService.sendOtpEmail(request.getEmail(), otp);
    }

    /**
     * Xử lý đăng ký doanh nghiệp (seller).
     * Chỉ sinh OTP và gửi email, chưa tạo tài khoản trong DB.
     */
    public void preRegisterSeller(RegisterSellerRequest request) {
        // Kiểm tra trùng lặp email và username
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên hiển thị đã được sử dụng");
        }

        // Lưu thông tin đăng ký tạm + sinh OTP
        String otp = generateOtp();
        OtpToken token = OtpToken.builder()
                .registerType("seller")
                .username(request.getUsername())
                .email(request.getEmail())
                .rawPassword(request.getPassword())
                .companyName(request.getCompanyName())
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(3))
                .build();

        pendingRegistrations.put(request.getEmail(), token);

        // Gửi email OTP
        emailService.sendOtpEmail(request.getEmail(), otp);
    }

    // ===== BƯỚC 2: Xác nhận OTP → tạo tài khoản thật =====

    /**
     * Xác thực OTP. Nếu đúng và còn hạn → tạo tài khoản trong DB.
     */
    public void verifyOtpAndRegister(VerifyOtpRequest request) {
        OtpToken token = pendingRegistrations.get(request.getEmail());

        // Không tìm thấy phiên đăng ký
        if (token == null) {
            throw new RuntimeException("Không tìm thấy yêu cầu đăng ký. Vui lòng thực hiện đăng ký lại.");
        }

        // OTP hết hạn
        if (LocalDateTime.now().isAfter(token.getExpiresAt())) {
            pendingRegistrations.remove(request.getEmail());
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng đăng ký lại.");
        }

        // OTP sai
        if (!token.getOtpCode().equals(request.getOtpCode())) {
            throw new RuntimeException("Mã OTP không chính xác.");
        }

        // OTP hợp lệ → tạo tài khoản
        if ("seller".equals(token.getRegisterType())) {
            createSellerAccount(token);
        } else {
            createUserAccount(token);
        }

        // Xóa khỏi bộ nhớ tạm sau khi tạo thành công
        pendingRegistrations.remove(request.getEmail());
    }

    /**
     * Gửi lại OTP mới cho email đang chờ xác thực.
     */
    public void resendOtp(ResendOtpRequest request) {
        OtpToken token = pendingRegistrations.get(request.getEmail());

        if (token == null) {
            throw new RuntimeException("Không tìm thấy yêu cầu đăng ký. Vui lòng thực hiện đăng ký lại.");
        }

        // Sinh OTP mới, reset thời hạn 3 phút
        String newOtp = generateOtp();
        token.setOtpCode(newOtp);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(3));
        pendingRegistrations.put(request.getEmail(), token);

        emailService.sendOtpEmail(request.getEmail(), newOtp);
    }

    // ===== TẠO TÀI KHOẢN THẬT (gọi sau khi OTP hợp lệ) =====

    private void createUserAccount(OtpToken token) {
        User user = new User();
        user.setUsername(token.getUsername());
        user.setEmail(token.getEmail());
        user.setPassword(passwordEncoder.encode(token.getRawPassword()));
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);
        user.setProvider(AuthProvider.LOCAL);
        userRepository.save(user);

        createWalletForUser(user);
        createProfileForUser(user);
    }

    private void createSellerAccount(OtpToken token) {
        User user = new User();
        user.setUsername(token.getUsername());
        user.setEmail(token.getEmail());
        user.setPassword(passwordEncoder.encode(token.getRawPassword()));
        user.setRole(UserRole.SELLER);
        user.setStatus(UserStatus.ACTIVE);
        user.setProvider(AuthProvider.LOCAL);
        userRepository.save(user);

        createWalletForUser(user);
        createProfileForUser(user);

        Business business = new Business();
        business.setUser(user);
        business.setBusinessName(token.getCompanyName());
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

    // ===== ĐĂNG NHẬP =====

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getUserId(),
                user.getRole().name()
        );
    }

    // Lấy thông tin user hiện tại (dùng sau khi OAuth2 login)
    public LoginResponse getMe() {
        User currentUser = securityUtil.getCurrentUser();

        return new LoginResponse(
                null,
                currentUser.getUsername(),
                currentUser.getUserId(),
                currentUser.getRole().name()
        );
    }

    // Đổi mật khẩu
    public void changePassword(ChangePasswordRequest request) {
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }

        if (passwordEncoder.matches(request.getNewPassword(), currentUser.getPassword())) {
            throw new RuntimeException("Mật khẩu mới không được trùng mật khẩu cũ");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

    // ===== HELPER =====

    /** Sinh OTP 6 chữ số ngẫu nhiên */
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // [100000, 999999]
        return String.valueOf(otp);
    }
}