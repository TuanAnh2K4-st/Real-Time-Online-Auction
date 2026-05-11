package vn.edu.nlu.fit.auction.mapper.Subscription;

import org.mapstruct.Mapper;

import vn.edu.nlu.fit.auction.dto.response.Subscription.SubscriptionPlanResponse;
import vn.edu.nlu.fit.auction.entity.SubscriptionPlan;

@Mapper(componentModel = "spring")
public interface SubscriptionPlanMapper {

    SubscriptionPlanResponse toResponse(SubscriptionPlan plan);
    
}
