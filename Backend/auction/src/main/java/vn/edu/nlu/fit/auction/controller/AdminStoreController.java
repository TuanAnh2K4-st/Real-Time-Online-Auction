package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateStoreRequest;
import vn.edu.nlu.fit.auction.dto.request.UpdateStoreRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.StoreResponse;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.enums.StoreStatus;
import vn.edu.nlu.fit.auction.mapper.StoreMapper;
import vn.edu.nlu.fit.auction.service.StoreService;

@RestController
@RequestMapping("/api/admin/stores")
@RequiredArgsConstructor
public class AdminStoreController {
    
    private final StoreService storeService;
    private final StoreMapper storeMapper;

    // GET danh sách store theo trạng thái
    @GetMapping("/list-by-status")
    public ResponseEntity<ApiResponse<List<StoreResponse>>> getStoresByStatus(
            @RequestParam("status") StoreStatus status) {

        List<StoreResponse> stores = storeService.getListStoresByStatus(status);
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách store thành công", stores));
    }
    
    // CREATE
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<StoreResponse>> createStore(@RequestBody CreateStoreRequest request) {
        StoreResponse response = storeService.createStore(request);
        return ResponseEntity.ok(new ApiResponse<>("Tạo store thành công", response));
    }

    // UPDATE store status
    @PostMapping("/update-status/{id}")
    public ResponseEntity<ApiResponse<StoreResponse>> updateStoreStatus(@PathVariable Integer id, @RequestBody UpdateStoreRequest request) {
        Store store = storeService.updateStoreStatus(id, request);
        return ResponseEntity.ok(new ApiResponse<>("Cập nhật trạng thái store thành công", storeMapper.toResponse(store)));
    }



}
