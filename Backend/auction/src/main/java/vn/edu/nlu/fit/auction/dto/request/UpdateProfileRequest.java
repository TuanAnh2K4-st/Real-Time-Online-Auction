package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;
import vn.edu.nlu.fit.auction.enums.Gender;

@Data 
public class UpdateProfileRequest {
    
    private String fullName;
    private String phone;
    private String job;
    private String bio;
    private Gender gender;

    private String street;
    private Integer provinceId;
    private Integer wardId;

}
