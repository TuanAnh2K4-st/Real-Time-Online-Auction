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
import vn.edu.nlu.fit.auction.dto.request.ProvinceRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.ProvinceResponse;
import vn.edu.nlu.fit.auction.service.ProvinceService;

@RestController
@RequestMapping("/api/provinces")
@RequiredArgsConstructor
public class ProvinceController {

    private final ProvinceService provinceService;

    // ===== CREATE =====
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProvinceResponse>> create(
            @RequestBody ProvinceRequest request) {

        ProvinceResponse data = provinceService.create(request);

        return ResponseEntity.status(201)
                .body(new ApiResponse<>("Created", data));
    }

    // ===== UPDATE =====
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<ProvinceResponse>> update(
            @PathVariable Integer id,
            @RequestBody ProvinceRequest request) {

        ProvinceResponse data = provinceService.update(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>("Updated", data)
        );
    }

    // ===== DELETE =====
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Integer id) {

        provinceService.delete(id);

        return ResponseEntity.ok(
                new ApiResponse<>("Deleted", null)
        );
    }

    // ===== GET ALL =====
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ProvinceResponse>>> getAll() {

        List<ProvinceResponse> data = provinceService.getAll();

        return ResponseEntity.ok(
                new ApiResponse<>("Success", data)
        );
    }
}
