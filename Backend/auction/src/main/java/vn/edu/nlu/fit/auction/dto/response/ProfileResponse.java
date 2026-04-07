package vn.edu.nlu.fit.auction.dto.response;

import lombok.Data;

@Data
public class ProfileResponse {

    private Integer profileId;
    private String fullName;
    private String phone;
    private String job;
    private String bio;
    private String gender;

    private String avatarUrl;

    private String street;
    private String provinceName;
    private String wardName;
    
}
