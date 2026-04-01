package vn.edu.nlu.fit.auction.dto.response;

public class ProvinceResponse {
    
    private Integer id;
    private String name;

    public ProvinceResponse(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    
}
