package vn.edu.nlu.fit.auction.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.StoreResponse;
import vn.edu.nlu.fit.auction.service.StoreService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;
    
    @GetMapping("/list-stores/active")
    public ApiResponse<List<StoreResponse>> getActiveStores() {
        List<StoreResponse> activeStores = storeService.getActiveStores();
        return new ApiResponse<>("Lấy danh sách stores thành công", activeStores);
    }
    
}
