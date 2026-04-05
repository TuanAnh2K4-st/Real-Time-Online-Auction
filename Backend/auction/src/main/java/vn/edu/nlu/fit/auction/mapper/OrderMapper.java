package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.edu.nlu.fit.auction.dto.response.OrderResponse;
import vn.edu.nlu.fit.auction.entity.Order;
import vn.edu.nlu.fit.auction.entity.ProductImage;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "productName", expression = "java(getProductName(order))")
    @Mapping(target = "productImage", expression = "java(getProductImage(order))")
    @Mapping(target = "status", expression = "java(order.getOrderStatus().name())")
    OrderResponse toResponse(Order order);

    // ===== CUSTOM =====
    default String getProductName(Order order) {
        if (order.getAuction() == null || order.getAuction().getProduct() == null) {
            return null;
        }
        return order.getAuction().getProduct().getProductName();
    }

    default String getProductImage(Order order) {
        if (order.getAuction() == null ||
            order.getAuction().getProduct() == null ||
            order.getAuction().getProduct().getImages() == null) {
            return null;
        }

        return order.getAuction().getProduct().getImages().stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(null);
    }
}