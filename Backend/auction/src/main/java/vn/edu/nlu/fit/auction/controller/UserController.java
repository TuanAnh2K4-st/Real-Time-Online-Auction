package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.nlu.fit.auction.dto.request.ChangeRoleRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterUserRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.UserResponse;
import vn.edu.nlu.fit.auction.service.UserService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService service;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/get-all")
    public ApiResponse<List<UserResponse>> getAll() {
        List<UserResponse> data = service.getAllUsers();
        return new ApiResponse<>("Success", data);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable Integer id) {
        service.deleteUserById(id);
        return new ApiResponse<>("User deleted successfully", null);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/status/{id}")
    public ApiResponse<String> toggleStatus(@PathVariable Integer id) {
        service.clickUserStatus(id);
        return new ApiResponse<>("User status toggled successfully", null);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-user")
    public ApiResponse<String> createUser(@RequestBody RegisterUserRequest request) {
        service.createUserByAdmin(request);
        return new ApiResponse<>("User created successfully", null);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-seller")
    public ApiResponse<String> createSeller(@RequestBody RegisterSellerRequest request) {
        service.createSellerByAdmin(request);
        return new ApiResponse<>("Seller created successfully", null);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/role/{id}")
    public ApiResponse<String> changeRole(
            @PathVariable Integer id,
            @RequestBody ChangeRoleRequest request) {

        service.changeUserRole(id, request.getRole());
        return new ApiResponse<>("User role updated successfully", null);
    }
}

