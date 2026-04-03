package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "wards")
public class Ward {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ward_id")
    private Integer wardId;

    @Column(name = "name", length = 150, nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id", nullable = false)
    private Province province;

    // Constructor

    public Ward() {
    }

    public Ward(Integer wardId, String name, Province province) {
        this.wardId = wardId;
        this.name = name;
        this.province = province;
    }

    // Getters and Setters

    public Integer getWardId() {
        return wardId;
    }

    public void setWardId(Integer wardId) {
        this.wardId = wardId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Province getProvince() {
        return province;
    }

    public void setProvince(Province province) {
        this.province = province;
    }
    
}
