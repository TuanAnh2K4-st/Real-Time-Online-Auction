package vn.edu.nlu.fit.auction.dto.request.Auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterSellerRequest {

    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Company name không được để trống")
    private String companyName;

    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotBlank(message = "Password không được để trống")
    private String password;

}
