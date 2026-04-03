package vn.edu.nlu.fit.auction.controller;

import java.util.List;
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

    @PostMapping("/create")
    public ApiResponse<WardResponse> create(@RequestBody WardRequest request) {
        return new ApiResponse<>("Created", wardService.create(request));
    }

    @PutMapping("/update/{id}")
    public ApiResponse<WardResponse> update(@PathVariable Integer id,
                                            @RequestBody WardRequest request) {
        return new ApiResponse<>("Updated", wardService.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        wardService.delete(id);
        return new ApiResponse<>("Deleted", null);
    }

    // GET theo province
    @GetMapping("/all-to-province/{provinceId}")
    public ApiResponse<List<WardResponse>> getByProvince(@PathVariable Integer provinceId) {
        return new ApiResponse<>("Success", wardService.getByProvince(provinceId));
    }
}
