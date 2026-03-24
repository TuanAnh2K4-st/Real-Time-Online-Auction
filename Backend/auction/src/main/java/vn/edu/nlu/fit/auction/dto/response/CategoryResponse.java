package vn.edu.nlu.fit.auction.dto.response;

public class CategoryResponse {
    private Integer id;
    private String name;
    private Integer parentId;

    public CategoryResponse(Integer id, String name, Integer parentId) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public Integer getParentId() {
        return parentId;
    }
}
