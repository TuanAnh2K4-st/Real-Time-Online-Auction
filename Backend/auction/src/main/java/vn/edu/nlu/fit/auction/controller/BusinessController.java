package vn.edu.nlu.fit.auction.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.UpdateBusinessRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.BusinessResponse;
import vn.edu.nlu.fit.auction.service.BusinessService;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;

    // ===== GET BUSINESS =====
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BusinessResponse>> getBusiness(
            @RequestParam Integer userId
    ) {

        BusinessResponse response = businessService.getMyBusiness(userId);

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy business thành công", response)
        );
    }

    // ===== UPDATE INFO =====
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<BusinessResponse>> updateBusiness(
            @RequestParam Integer userId,
            @RequestBody UpdateBusinessRequest request
    ) {

        BusinessResponse response = businessService.updateBusiness(userId, request);

        return ResponseEntity.ok(
                new ApiResponse<>("Update business thành công", response)
        );
    }

    // ===== UPDATE LOGO =====
    @PutMapping(value = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateLogo(
            @RequestParam Integer userId,
            @RequestPart MultipartFile logo
    ) {

        String logoUrl = businessService.updateLogo(userId, logo);

        return ResponseEntity.ok(
                new ApiResponse<>("Update logo thành công", logoUrl)
        );
    }
}
