package vn.edu.nlu.fit.auction.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.UpdateBusinessRequest;
import vn.edu.nlu.fit.auction.dto.response.BusinessResponse;
import vn.edu.nlu.fit.auction.entity.Address;
import vn.edu.nlu.fit.auction.entity.Business;
import vn.edu.nlu.fit.auction.entity.Province;
import vn.edu.nlu.fit.auction.entity.Ward;
import vn.edu.nlu.fit.auction.mapper.BusinessMapper;
import vn.edu.nlu.fit.auction.repository.AddressRepository;
import vn.edu.nlu.fit.auction.repository.BusinessRepository;
import vn.edu.nlu.fit.auction.repository.ProvinceRepository;
import vn.edu.nlu.fit.auction.repository.WardRepository;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessRepository businessRepository;
    private final AddressRepository addressRepository;
    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;
    private final CloudinaryService cloudinaryService;
    private final BusinessMapper businessMapper;

    // GET BUSINESS BY USER ID
    public BusinessResponse getMyBusiness(Integer userId) {

        Business business = businessRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        return businessMapper.toResponse(business);
    }

    // ===== UPDATE INFO =====
    public BusinessResponse updateBusiness(Integer userId, UpdateBusinessRequest req) {

        Business business = businessRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        // mapper
        businessMapper.updateBusiness(business, req);

        // address
        if (req.getProvinceId() != null && req.getWardId() != null) {

            Province province = provinceRepository.findById(req.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found"));

            Ward ward = wardRepository.findById(req.getWardId())
                    .orElseThrow(() -> new RuntimeException("Ward not found"));

            if (!ward.getProvince().getProvinceId().equals(province.getProvinceId())) {
                throw new RuntimeException("Ward không thuộc province");
            }

            Address address = business.getAddress();

            if (address == null) {
                address = new Address();
            }

            address.setStreet(req.getStreet());
            address.setProvince(province);
            address.setWard(ward);

            addressRepository.save(address);
            business.setAddress(address);
        }

        return businessMapper.toResponse(businessRepository.save(business));
    }

    // ===== UPDATE LOGO =====
    public String updateLogo(Integer userId, MultipartFile logo) {

        if (logo == null || logo.isEmpty()) {
            throw new RuntimeException("Logo không hợp lệ");
        }

        Business business = businessRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        // xóa logo cũ
        cloudinaryService.deleteFile(business.getLogoPublicId());

        // upload logo mới
        Map<String, String> result = cloudinaryService.uploadFile(logo);

        business.setLogoUrl(result.get("url"));
        business.setLogoPublicId(result.get("publicId"));

        businessRepository.save(business);

        return result.get("url");
    }
}
