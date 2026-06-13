package vn.edu.nlu.fit.auction.controller.Profile;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Profile.UpdateBusinessRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Profile.BusinessResponse;
import vn.edu.nlu.fit.auction.service.Profile.BusinessService;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;

    // ===== GET BUSINESS =====
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BusinessResponse>> getBusiness() {

        BusinessResponse response = businessService.getMyBusiness();

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy business thành công", response)
        );
    }

    // ===== UPDATE INFO =====
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<BusinessResponse>> updateBusiness(
            @RequestBody UpdateBusinessRequest body
    ) {

        BusinessResponse response = businessService.updateBusiness(body);

        return ResponseEntity.ok(
                new ApiResponse<>("Update business thành công", response)
        );
    }

}
