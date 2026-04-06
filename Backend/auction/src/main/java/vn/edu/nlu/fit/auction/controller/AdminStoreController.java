package vn.edu.nlu.fit.auction.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateStoreRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.StoreResponse;
import vn.edu.nlu.fit.auction.service.StoreService;

@RestController
@RequestMapping("/api/admin/stores")
@RequiredArgsConstructor
public class AdminStoreController {
    
    private final StoreService storeService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<StoreResponse>> createStore(@RequestBody CreateStoreRequest request) {
        StoreResponse response = storeService.createStore(request);
        return ResponseEntity.ok(new ApiResponse<>("Tạo store thành công", response));
    }

}
