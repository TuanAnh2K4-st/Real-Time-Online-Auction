package vn.edu.nlu.fit.auction.service.Profile;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Profile.UpdateBusinessRequest;
import vn.edu.nlu.fit.auction.dto.response.Profile.BusinessResponse;
import vn.edu.nlu.fit.auction.entity.Business;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.mapper.Profile.BusinessMapper;
import vn.edu.nlu.fit.auction.repository.Profile.BusinessRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessRepository businessRepository;
    private final BusinessMapper businessMapper;
    private final SecurityUtil securityUtil;

    // chức năng lấy business của user hiện tại
    public BusinessResponse getMyBusiness() {

        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Business business = businessRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        return businessMapper.toResponse(business);
    }

    // chức năng cập nhật thông tin business
    public BusinessResponse updateBusiness( UpdateBusinessRequest req) {

        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Business business = businessRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        // câp nhật thông tin business
        businessMapper.updateBusiness(business, req);

        return businessMapper.toResponse(businessRepository.save(business));
    }

}
