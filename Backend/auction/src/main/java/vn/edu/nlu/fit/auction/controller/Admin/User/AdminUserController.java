package vn.edu.nlu.fit.auction.controller.Admin.User;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.User.ChangeRoleRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.User.CreateUserRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.User.UserFilterRequest;
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
    public ApiResponse<List<AdminUserResponse>> getUsers( @RequestBody UserFilterRequest request) {

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

    // CHANGE STATUS
    @PutMapping("/change-status/{userId}")
    public ApiResponse<String> changeStatus(
            @PathVariable Integer userId
    ) {

        adminUserService.changeStatus(userId);

        return new ApiResponse<>(
                "Đổi trạng thái user thành công",
                null
        );
    }

    // CHANGE ROLE
    @PutMapping("/{userId}/role")
    public ApiResponse<String> changeRole( @PathVariable Integer userId, @RequestBody ChangeRoleRequest request) {

        adminUserService.changeRole( userId, request.getUserRole());

        return new ApiResponse<>(
                "Đổi role user thành công",
                null
        );
    }

    @PostMapping("/create-user")
    public ApiResponse<String> createUser( @RequestBody CreateUserRequest request ) {
        System.out.println(request.getUserRole());
        adminUserService.createUser(request);

        return new ApiResponse<>(
                "Tạo tài khoản thành công",
                null
        );
    }
    
}