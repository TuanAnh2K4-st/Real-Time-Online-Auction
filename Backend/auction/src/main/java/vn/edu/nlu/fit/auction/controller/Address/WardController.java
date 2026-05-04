package vn.edu.nlu.fit.auction.controller.Address;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Address.WardResponse;
import vn.edu.nlu.fit.auction.service.Address.WardService;

@RestController
@RequestMapping("/api/wards")
@RequiredArgsConstructor
public class WardController {

    private final WardService wardService;

    // Api lấy tất cả xã phường theo tỉnh thành phố
    @GetMapping("/all-to-province/{provinceId}")
    public ResponseEntity<ApiResponse<List<WardResponse>>> getByProvince(
            @PathVariable Integer provinceId) {

        List<WardResponse> data = wardService.getByProvince(provinceId);

        return ResponseEntity.ok(
                new ApiResponse<>("Success", data)
        );
    }
}
