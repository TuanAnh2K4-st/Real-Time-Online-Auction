package vn.edu.nlu.fit.auction.service.Profile;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.repository.Profile.ProfileRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;
import vn.edu.nlu.fit.auction.service.Cloudinary.CloudinaryService;
import vn.edu.nlu.fit.auction.repository.Address.AddressRepository;
import vn.edu.nlu.fit.auction.repository.Address.ProvinceRepository;
import vn.edu.nlu.fit.auction.repository.Address.WardRepository;
import vn.edu.nlu.fit.auction.mapper.Profile.ProfileMapper;
import vn.edu.nlu.fit.auction.dto.request.Profile.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.dto.response.Profile.ProfileResponse;
import vn.edu.nlu.fit.auction.entity.Address;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.Province;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.Ward;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final AddressRepository addressRepository;
    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;
    private final CloudinaryService cloudinaryService;
    private final ProfileMapper profileMapper;
    private final SecurityUtil securityUtil;
    private final WalletRepository walletRepository;

    private void attachWalletBalance(ProfileResponse response, Integer userId) {
        walletRepository.findByUserId(userId).ifPresent(w -> response.setWalletBalance(w.getBalance()));
    }

    // chức năng lấy profile của user hiện tại
    public ProfileResponse getMyProfile() {

        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        ProfileResponse response = profileMapper.toResponse(profile);
        attachWalletBalance(response, currentUser.getUserId());
        return response;
    }

    // chức năng cập nhật thông tin profile
    public ProfileResponse updateProfile(UpdateProfileRequest req) {

        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // câp nhật thông tin profile
        profileMapper.updateProfile(profile, req);

        // câp nhật địa chỉ nếu có thay đổi
        if (req.getProvinceId() != null && req.getWardId() != null) {

            Province province = provinceRepository.findById(req.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province không tìm thấy"));

            Ward ward = wardRepository.findById(req.getWardId())
                    .orElseThrow(() -> new RuntimeException("Ward không tìm thấy"));

            if (!ward.getProvince().getProvinceId().equals(province.getProvinceId())) {
                throw new RuntimeException("Ward không thuộc province");
            }

            Address address = profile.getAddress();

            if (address == null) {
                address = new Address();
            }

            address.setStreet(req.getStreet());
            address.setProvince(province);
            address.setWard(ward);

            addressRepository.save(address);
            profile.setAddress(address);
        }

        ProfileResponse response = profileMapper.toResponse(profileRepository.save(profile));
        attachWalletBalance(response, currentUser.getUserId());
        return response;
    }

    // chức năng cập nhật avatar
    public String updateAvatar(MultipartFile avatar) {

        if (avatar == null || avatar.isEmpty()) {
            throw new RuntimeException("Avatar không hợp lệ");
        }

        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Xóa ảnh cũ
        cloudinaryService.deleteFile(profile.getAvatarPublicId());

        // Upload ảnh mới
        Map<String, String> result = cloudinaryService.uploadFile(avatar);

        profile.setAvatarUrl(result.get("url"));
        profile.setAvatarPublicId(result.get("publicId"));

        profileRepository.save(profile);

        return result.get("url");
    }
}
