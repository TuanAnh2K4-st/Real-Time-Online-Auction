package vn.edu.nlu.fit.auction.dto.request;

import vn.edu.nlu.fit.auction.enums.UserRole;

public class ChangeRoleRequest {
    private UserRole role;

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
