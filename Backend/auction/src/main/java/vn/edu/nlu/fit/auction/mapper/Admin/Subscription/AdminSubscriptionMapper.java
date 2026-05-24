package vn.edu.nlu.fit.auction.mapper.Admin.Subscription;

import org.mapstruct.Mapper;

import vn.edu.nlu.fit.auction.dto.request.Admin.Subscription.CreateSubscriptionRequest;
import vn.edu.nlu.fit.auction.dto.response.Admin.Subscription.AdminSubscriptionResponse;
import vn.edu.nlu.fit.auction.entity.SubscriptionPlan;

@Mapper(componentModel = "spring")
public interface AdminSubscriptionMapper {

    AdminSubscriptionResponse toResponse(SubscriptionPlan entity);

    SubscriptionPlan toEntity(CreateSubscriptionRequest request);
    
}
