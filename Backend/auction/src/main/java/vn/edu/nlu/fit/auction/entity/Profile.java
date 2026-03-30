package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import vn.edu.nlu.fit.auction.enums.Gender;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Integer profileId;

    // 1-1 with User
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // 1-1 with Address
    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "avatar_public_id")
    private String avatarPublicId;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "job")
    private String job;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "update_at")
    private LocalDateTime updatedAt;

    // ===== AUTO SET TIME =====
    @PreUpdate 
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructors

    public Profile(Integer profileId, User user, Address address, String avatarUrl, String avatarPublicId,
            String fullName, String phone, Gender gender, String job, String bio, LocalDateTime updatedAt) {
        this.profileId = profileId;
        this.user = user;
        this.address = address;
        this.avatarUrl = avatarUrl;
        this.avatarPublicId = avatarPublicId;
        this.fullName = fullName;
        this.phone = phone;
        this.gender = gender;
        this.job = job;
        this.bio = bio;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters

    public Integer getProfileId() {
        return profileId;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getAvatarPublicId() {
        return avatarPublicId;
    }

    public void setAvatarPublicId(String avatarPublicId) {
        this.avatarPublicId = avatarPublicId;
    }

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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    } 

}