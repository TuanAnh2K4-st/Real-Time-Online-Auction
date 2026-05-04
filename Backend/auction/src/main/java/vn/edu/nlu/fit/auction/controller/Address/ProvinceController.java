package vn.edu.nlu.fit.auction.controller.Address;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Address.ProvinceResponse;
import vn.edu.nlu.fit.auction.service.Address.ProvinceService;

@RestController
@RequestMapping("/api/provinces")
@RequiredArgsConstructor
public class ProvinceController {

    private final ProvinceService provinceService;

    // Api lấy tất cả tỉnh thành phố
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ProvinceResponse>>> getAll() {

        List<ProvinceResponse> data = provinceService.getAll();

        return ResponseEntity.ok(
                new ApiResponse<>("Success", data)
        );
    }
}
