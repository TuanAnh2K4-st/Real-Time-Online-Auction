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
import vn.edu.nlu.fit.auction.dto.request.ProvinceRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.ProvinceResponse;
import vn.edu.nlu.fit.auction.service.ProvinceService;

@RestController
@RequestMapping("/api/provinces")
@RequiredArgsConstructor
public class ProvinceController {

    private final ProvinceService provinceService;

    @PostMapping("/create")
    public ApiResponse<ProvinceResponse> create(@RequestBody ProvinceRequest request) {
        return new ApiResponse<>(
            "Created",
            provinceService.create(request)
        );
    }

    @PutMapping("/update/{id}")
    public ApiResponse<ProvinceResponse> update(@PathVariable Integer id,
                                                @RequestBody ProvinceRequest request) {
        return new ApiResponse<>("Updated", provinceService.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        provinceService.delete(id);
        return new ApiResponse<>("Deleted", null);
    }

    @GetMapping("/all")
    public ApiResponse<List<ProvinceResponse>> getAll() {
        return new ApiResponse<>("Success", provinceService.getAll());
    }
}
