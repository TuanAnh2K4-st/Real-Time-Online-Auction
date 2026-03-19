package vn.edu.nlu.fit.auction.dto.response;

import vn.edu.nlu.fit.auction.enums.Gender;

public class ProfileResponse {

    private String fullName;
    private String phone;
    private String address;
    private Gender gender;
    private String job;
    private String bio;
    private String avatarUrl;

    public ProfileResponse(String fullName, String phone, String address,
                           Gender gender, String job, String bio, String avatarUrl) {
        this.fullName = fullName;
        this.phone = phone;
        this.address = address;
        this.gender = gender;
        this.job = job;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }

    public String getFullName() { 
        return fullName; 
    }
    public String getPhone() { 
        return phone; 
    }
    public String getAddress() { 
        return address; 
    }
    public Gender getGender() { 
        return gender; 
    }
    public String getJob() { 
        return job; 
    }
    public String getBio() { 
        return bio; 
    }
    public String getAvatarUrl() { 
        return avatarUrl; 
    }
}