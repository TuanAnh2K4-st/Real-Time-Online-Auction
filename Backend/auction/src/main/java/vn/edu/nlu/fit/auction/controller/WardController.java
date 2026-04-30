package vn.edu.nlu.fit.auction.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.WardRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.WardResponse;
import vn.edu.nlu.fit.auction.service.WardService;

@RestController
@RequestMapping("/api/wards")
@RequiredArgsConstructor
public class WardController {

    private final WardService wardService;

    // ===== CREATE =====
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<WardResponse>> create(
            @RequestBody WardRequest request) {

        WardResponse data = wardService.create(request);

        return ResponseEntity.status(201)
                .body(new ApiResponse<>("Created", data));
    }

    // ===== UPDATE =====
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<WardResponse>> update(
            @PathVariable Integer id,
            @RequestBody WardRequest request) {

        WardResponse data = wardService.update(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>("Updated", data)
        );
    }

    // ===== DELETE =====
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Integer id) {

        wardService.delete(id);

        return ResponseEntity.ok(
                new ApiResponse<>("Deleted", null)
        );
    }

    // ===== GET BY PROVINCE =====
    @GetMapping("/all-to-province/{provinceId}")
    public ResponseEntity<ApiResponse<List<WardResponse>>> getByProvince(
            @PathVariable Integer provinceId) {

        List<WardResponse> data = wardService.getByProvince(provinceId);

        return ResponseEntity.ok(
                new ApiResponse<>("Success", data)
        );
    }
}
