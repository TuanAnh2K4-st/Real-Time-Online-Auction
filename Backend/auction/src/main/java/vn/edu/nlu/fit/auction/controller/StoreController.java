package vn.edu.nlu.fit.auction.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.StoreResponse;
import vn.edu.nlu.fit.auction.service.StoreService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    // ===== GET ALL ACTIVE STORES =====
    @GetMapping("/list-stores/active")
    public ResponseEntity<ApiResponse<List<StoreResponse>>> getActiveStores() {

        List<StoreResponse> data = storeService.getActiveStores();

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy danh sách stores thành công", data)
        );
    }

    // ===== GET STORES BY PROVINCE =====
    @GetMapping("/by-province/{provinceId}")
    public ResponseEntity<ApiResponse<List<StoreResponse>>> getStoresByProvince(
            @PathVariable Integer provinceId) {

        List<StoreResponse> data = storeService.getStoresByProvince(provinceId);

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy store theo tỉnh thành công", data)
        );
    }
}