package vn.edu.nlu.fit.auction.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.UpdateBusinessRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.BusinessResponse;
import vn.edu.nlu.fit.auction.service.BusinessService;
import vn.edu.nlu.fit.auction.security.JwtService;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;
    private final JwtService jwtService;

    // ===== GET BUSINESS =====
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BusinessResponse>> getBusiness(
            HttpServletRequest request
    ) {
        Integer userId = extractUserId(request);

        BusinessResponse response = businessService.getMyBusiness(userId);

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy business thành công", response)
        );
    }

    // ===== UPDATE INFO =====
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<BusinessResponse>> updateBusiness(
            HttpServletRequest request,
            @RequestBody UpdateBusinessRequest body
    ) {
        Integer userId = extractUserId(request);

        BusinessResponse response = businessService.updateBusiness(userId, body);

        return ResponseEntity.ok(
                new ApiResponse<>("Update business thành công", response)
        );
    }

    // ===== UPDATE LOGO =====
    @PutMapping(value = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateLogo(
            HttpServletRequest request,
            @RequestPart MultipartFile logo
    ) {
        Integer userId = extractUserId(request);

        String logoUrl = businessService.updateLogo(userId, logo);

        return ResponseEntity.ok(
                new ApiResponse<>("Update logo thành công", logoUrl)
        );
    }

    // ===== HELPER METHOD =====
    private Integer extractUserId(HttpServletRequest request) {
                String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        return jwtService.extractUserId(token);
    }
}
