package vn.edu.nlu.fit.auction.dto.response;

public class DistrictResponse {
    
    private Integer id;
    private String name;
    private Integer provinceId;
    private String provinceName;

    public DistrictResponse(Integer id, String name, Integer provinceId, String provinceName) {
        this.id = id;
        this.name = name;
        this.provinceId = provinceId;
        this.provinceName = provinceName;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getProvinceId() {
        return provinceId;
    }

    public String getProvinceName() {
        return provinceName;
    }

    
}
