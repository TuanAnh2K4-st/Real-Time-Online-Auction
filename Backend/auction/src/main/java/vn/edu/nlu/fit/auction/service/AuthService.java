package vn.edu.nlu.fit.auction.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import vn.edu.nlu.fit.auction.dto.request.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterUserRequest;
import vn.edu.nlu.fit.auction.dto.response.LoginResponse;
import vn.edu.nlu.fit.auction.entity.AuctionRoom;
import vn.edu.nlu.fit.auction.entity.Business;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.AuthProvider;
import vn.edu.nlu.fit.auction.enums.RoomStatus;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.mapper.UserMapper;
import vn.edu.nlu.fit.auction.repository.AuctionRoomRepository;
import vn.edu.nlu.fit.auction.repository.BusinessRepository;
import vn.edu.nlu.fit.auction.repository.ProfileRepository;
import vn.edu.nlu.fit.auction.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private AuctionRoomRepository auctionRoomRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // REGISTER USER
    public void registerUser(RegisterUserRequest request) {

        // check duplicate
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // map user
        User user = userMapper.toRegisterUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);
        user.setProvider(AuthProvider.LOCAL);

        userRepository.save(user);

        // create profile
        Profile profile = new Profile();
        profile.setUser(user);

        profileRepository.save(profile);
    }

    // REGISTER SELLER
    public void registerSeller(RegisterSellerRequest request) {

        // Kiểm tra trùng lặp email và username
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getCompanyName())) {
            throw new RuntimeException("Username already exists");
        }

        // create user
        User user = userMapper.toRegisterSeller(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.SELLER);
        user.setStatus(UserStatus.ACTIVE);
        user.setProvider(AuthProvider.LOCAL);

        userRepository.save(user);

        // create business
        Business business = new Business();
        business.setUser(user);
        businessRepository.save(business);

        // create auction room
        AuctionRoom room = new AuctionRoom();
        room.setHost(user);
        room.setRoomName(request.getRoomName());
        room.setRoomCode(generateRoomCode());
        room.setRoomStatus(RoomStatus.WAITING);

        auctionRoomRepository.save(room);
    }

    // tao room code ngau nhien 10 ky tu
    private String generateRoomCode() {
        return UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }

    // LOGIN
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        // check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        // tạo token
        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                user.getUserId(),
                user.getRole().name()
        );
    }
}