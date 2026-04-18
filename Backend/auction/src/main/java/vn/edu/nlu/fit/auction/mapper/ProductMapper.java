package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.nlu.fit.auction.dto.request.CreateProductRequest;
import vn.edu.nlu.fit.auction.dto.response.ProductResponse;
import vn.edu.nlu.fit.auction.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)  
    @Mapping(target = "images", ignore = true)
    Product toEntity(CreateProductRequest request);

    @Mapping(source = "productId", target = "id")
    @Mapping(source = "category.categoryId", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    ProductResponse toResponse(Product product);
}
