package vn.edu.nlu.fit.auction.service;

import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.dto.response.ProfileResponse;
import vn.edu.nlu.fit.auction.entity.Address;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.Province;
import vn.edu.nlu.fit.auction.entity.Ward;
import vn.edu.nlu.fit.auction.mapper.ProfileMapper;
import vn.edu.nlu.fit.auction.repository.AddressRepository;
import vn.edu.nlu.fit.auction.repository.ProfileRepository;
import vn.edu.nlu.fit.auction.repository.ProvinceRepository;
import vn.edu.nlu.fit.auction.repository.WardRepository;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final AddressRepository addressRepository;
    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;
    private final CloudinaryService cloudinaryService;
    private final ProfileMapper profileMapper;

    // GET PROFILE BY USER ID
    public ProfileResponse getMyProfile(Integer userId) {

        Profile profile = profileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return profileMapper.toResponse(profile);
    }

    // ===== UPDATE PROFILE INFO =====
    public ProfileResponse updateProfile(Integer userId, UpdateProfileRequest req) {

        Profile profile = profileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // mapper
        profileMapper.updateProfile(profile, req);

        // address
        if (req.getProvinceId() != null && req.getWardId() != null) {

            Province province = provinceRepository.findById(req.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found"));

            Ward ward = wardRepository.findById(req.getWardId())
                    .orElseThrow(() -> new RuntimeException("Ward not found"));

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

        return profileMapper.toResponse(profileRepository.save(profile));
    }

    // ===== UPDATE AVATAR =====
    public String updateAvatar(Integer userId, MultipartFile avatar) {

        if (avatar == null || avatar.isEmpty()) {
            throw new RuntimeException("Avatar không hợp lệ");
        }

        Profile profile = profileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // 1. Xóa ảnh cũ
        cloudinaryService.deleteFile(profile.getAvatarPublicId());

        // 2. Upload ảnh mới
        Map<String, String> result = cloudinaryService.uploadFile(avatar);

        profile.setAvatarUrl(result.get("url"));
        profile.setAvatarPublicId(result.get("publicId"));

        profileRepository.save(profile);

        return result.get("url");
    }
}
