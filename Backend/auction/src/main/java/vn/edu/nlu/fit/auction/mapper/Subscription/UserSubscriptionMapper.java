package vn.edu.nlu.fit.auction.mapper.Subscription;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.edu.nlu.fit.auction.dto.response.Subscription.UserSubscriptionResponse;
import vn.edu.nlu.fit.auction.entity.UserSubscription;

@Mapper(componentModel = "spring")
public interface UserSubscriptionMapper {

    @Mapping(target = "planId", source = "plan.id")
    @Mapping(target = "planName", source = "plan.name")
    @Mapping(target = "price", source = "plan.price")
    @Mapping(target = "durationDays", source = "plan.durationDays")
    @Mapping(target = "maxLiveRooms", source = "plan.maxLiveRooms")
    @Mapping(target = "startDate", source = "startDate")
    @Mapping(target = "endDate", source = "endDate")
    @Mapping(target = "status", source = "status")
    UserSubscriptionResponse toResponse(UserSubscription subscription);
    
}
