package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.nlu.fit.auction.dto.request.CreateProductRequest;
import vn.edu.nlu.fit.auction.dto.response.ProductResponse;
import vn.edu.nlu.fit.auction.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "user", ignore = true) // User sẽ được set trong service
    @Mapping(target = "category", ignore = true) // Category sẽ được set trong service
    @Mapping(target = "createdAt", ignore = true) // createdAt sẽ được set tự động  
    @Mapping(target = "images", ignore = true) // Hình ảnh sẽ được xử lý riêng
    Product toEntity(CreateProductRequest request);

    @Mapping(source = "productId", target = "id")
    @Mapping(source = "category.categoryId", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    ProductResponse toResponse(Product product);
}
