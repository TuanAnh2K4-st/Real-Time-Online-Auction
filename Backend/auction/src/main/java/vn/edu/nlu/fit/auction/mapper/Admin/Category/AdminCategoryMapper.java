package vn.edu.nlu.fit.auction.mapper.Admin.Category;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.edu.nlu.fit.auction.dto.response.Admin.Category.AdminCategoryResponse;
import vn.edu.nlu.fit.auction.dto.response.Admin.Category.ParentCategoryResponse;
import vn.edu.nlu.fit.auction.entity.Category;

@Mapper(componentModel = "spring")
public interface AdminCategoryMapper {

    @Mapping(target = "parent", expression = "java(mapParent(category))")
    @Mapping(target = "childrenIds", expression = "java(mapChildren(category))")
    AdminCategoryResponse toResponse(Category category);

    List<AdminCategoryResponse> toResponse(List<Category> categories);

    default ParentCategoryResponse mapParent(Category category) {

        if(category.getParent() == null) {
            return null;
        }

        return ParentCategoryResponse.builder()
                .categoryId(category.getParent().getCategoryId())
                .name(category.getParent().getName())
                .build();
    }

    default List<Integer> mapChildren(Category category) {

        if(category.getChildren() == null) {
            return List.of();
        }

        return category.getChildren()
                .stream()
                .map(Category::getCategoryId)
                .toList();
    }
    
}
