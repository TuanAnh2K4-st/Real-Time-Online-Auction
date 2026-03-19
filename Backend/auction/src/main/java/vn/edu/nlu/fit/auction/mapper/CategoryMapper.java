package vn.edu.nlu.fit.auction.mapper;

import vn.edu.nlu.fit.auction.dto.response.CategoryResponse;
import vn.edu.nlu.fit.auction.entity.Category;

public class CategoryMapper {
    public static CategoryResponse toResponse(Category c) {
        return new CategoryResponse(
                c.getCategoryId(),
                c.getName()
        );
    }
}
