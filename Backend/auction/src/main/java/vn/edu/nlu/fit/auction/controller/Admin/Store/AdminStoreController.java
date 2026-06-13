package vn.edu.nlu.fit.auction.controller.Admin.Store;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.Store.CreateStoreRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Store.FilterStoreRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Store.UpdateStoreRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Admin.Store.AdminStoreResponse;
import vn.edu.nlu.fit.auction.service.Admin.Store.AdminStoreService;

@RestController
@RequestMapping("/api/admin/stores")
@RequiredArgsConstructor
public class AdminStoreController {

    private final AdminStoreService adminStoreService;

    @PostMapping("/filter")
    public ApiResponse<List<AdminStoreResponse>> getStores(@RequestBody FilterStoreRequest request) {

        List<AdminStoreResponse> stores = adminStoreService.getStores(
                        request.getStoreName(),
                        request.getStatus()
                );

        return new ApiResponse<>(
                "Lấy danh sách store thành công",
                stores
        );
    }

    @PostMapping("/create-store")
    public ApiResponse<String> createStore( @RequestBody CreateStoreRequest request) {

        adminStoreService.createStore(request);

        return new ApiResponse<>(
                "Tạo store thành công",
                null
        );
    }

    @PutMapping("/update-store/{storeId}")
    public ApiResponse<String> updateStore(@PathVariable Integer storeId, @RequestBody UpdateStoreRequest request) {

        adminStoreService.updateStore(storeId,request);

        return new ApiResponse<>(
                "Cập nhật store thành công",
                null
        );
    }
}