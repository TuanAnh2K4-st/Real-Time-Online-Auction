package vn.edu.nlu.fit.auction.dto.request;

import vn.edu.nlu.fit.auction.enums.Gender;

public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String address;
    private Gender gender;
    private String job;
    private String bio;

    // Getters and Setters

    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public Gender getGender() {
        return gender;
    }
    public void setGender(Gender gender) {
        this.gender = gender;
    }
    public String getJob() {
        return job;
    }
    public void setJob(String job) {
        this.job = job;
    }
    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }    
}
