package vn.edu.nlu.fit.auction.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterSellerRequest {

    @NotBlank(message = "Company name không được để trống")
    private String companyName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    @NotBlank(message = "Password không được để trống")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{12,}$",
        message = "Password phải có ít nhất 12 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    )
    private String password;

    @NotBlank(message = "Room name không được để trống")
    private String roomName;

}
