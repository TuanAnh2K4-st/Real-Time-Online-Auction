package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "address")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Integer addressId;

    @Column(name = "street", length = 255, nullable = false)
    private String street;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id", nullable = false)
    private Province province;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;

    // ===== CUSTOM ADDRESS =====
    public String getFullAddress() {

        String provinceName =
                province != null
                        ? province.getName()
                        : "";

        String wardName =
                ward != null
                        ? ward.getName()
                        : "";

        return street
                + ", "
                + wardName
                + ", "
                + provinceName;
    }

}

