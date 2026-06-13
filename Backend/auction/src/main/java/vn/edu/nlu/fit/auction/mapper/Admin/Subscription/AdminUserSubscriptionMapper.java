package vn.edu.nlu.fit.auction.mapper.Admin.Subscription;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.nlu.fit.auction.dto.response.Admin.Subscription.AdminUserSubscriptionResponse;
import vn.edu.nlu.fit.auction.entity.UserSubscription;

@Mapper(componentModel = "spring")
public interface AdminUserSubscriptionMapper {

    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "subscriptionPlanName", source = "plan.name")
    @Mapping(target = "maxLiveRooms", source = "plan.maxLiveRooms")
    AdminUserSubscriptionResponse toResponse(UserSubscription entity);
}
