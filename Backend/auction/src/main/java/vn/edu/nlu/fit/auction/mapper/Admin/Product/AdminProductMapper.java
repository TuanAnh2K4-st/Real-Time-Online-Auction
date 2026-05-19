package vn.edu.nlu.fit.auction.mapper.Admin.Product;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.edu.nlu.fit.auction.dto.response.Admin.Product.AdminProductResponse;
import vn.edu.nlu.fit.auction.entity.ProductImage;
import vn.edu.nlu.fit.auction.entity.StoreItem;

@Mapper(componentModel = "spring")
public interface AdminProductMapper {

    @Mapping(target = "storeItemId",
            source = "storeItemId")

    @Mapping(target = "itemStatus",
            source = "itemStatus")

    @Mapping(target = "conditionNote",
            source = "conditionNote")

    // ===== PRODUCT =====
    @Mapping(target = "productName",
            source = "product.productName")

    @Mapping(target = "brand",
            source = "product.brand")

    @Mapping(target = "origin",
            source = "product.origin")

    @Mapping(target = "productCondition",
            source = "product.productCondition")

    @Mapping(target = "description",
            source = "product.description")

    @Mapping(target = "attributesJson",
            source = "product.attributesJson")

    @Mapping(target = "basePrice",
            source = "product.basePrice")

    @Mapping(target = "createdAt",
            source = "product.createdAt")

    // ===== CATEGORY =====
    @Mapping(target = "categoryName",
            source = "product.category.name")

    // ===== USER =====
    @Mapping(target = "userId",
        source = "product.user.userId")

    // ===== THUMBNAIL =====
    @Mapping(
            target = "thumbnail",
            expression =
            "java(getThumbnail(storeItem))"
    )

    AdminProductResponse toResponse(
            StoreItem storeItem
    );

    // ===== CUSTOM METHOD =====
    default String getThumbnail(StoreItem storeItem) {

        if (storeItem.getProduct() == null
                || storeItem.getProduct().getImages() == null) {
            return null;
        }

        return storeItem.getProduct()
                .getImages()
                .stream()
                .filter(ProductImage::getIsPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);
    }
}
