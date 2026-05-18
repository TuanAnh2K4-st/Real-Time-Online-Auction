package vn.edu.nlu.fit.auction.controller.Admin.User;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.User.AdminUserFilterRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Admin.User.AdminUserResponse;
import vn.edu.nlu.fit.auction.service.Admin.User.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/filter")
    public ApiResponse<List<AdminUserResponse>> getUsers(
            @RequestBody AdminUserFilterRequest request
    ) {

        List<AdminUserResponse> users =
                adminUserService.getUsers(
                        request.getKeyword(),
                        request.getRole()
                );

        return new ApiResponse<>(
                "Lấy danh sách user thành công",
                users
        );
    }
}