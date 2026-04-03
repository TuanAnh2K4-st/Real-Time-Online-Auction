package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.UpdateUserRequest;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.service.AdminUserService;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    // UPDATE USER
    @PutMapping("update/{id}")
    public User updateUser(
            @PathVariable Integer id,
            @RequestBody UpdateUserRequest request
    ) {
        return adminUserService.updateUser(id, request);
    }

    // ===== DELETE =====
    @DeleteMapping("delete/{id}")
    public String deleteUser(@PathVariable Integer id) {
        adminUserService.deleteUser(id);
        return "Deleted successfully";
    }

    // ===== SEARCH EMAIL =====
    @GetMapping("search")
    public List<User> searchByEmail(@RequestParam String email) {
        return adminUserService.searchByEmail(email);
    }

    // ===== GET BY ROLE =====
    @GetMapping("role")
    public List<User> getByRole(@RequestParam UserRole role) {
        return adminUserService.getByRole(role);
    }

    // ===== TOGGLE STATUS =====
    @PatchMapping("toggle-status/{id}")
    public User toggleStatus(@PathVariable Integer id) {
        return adminUserService.toggleStatus(id);
    }
}
