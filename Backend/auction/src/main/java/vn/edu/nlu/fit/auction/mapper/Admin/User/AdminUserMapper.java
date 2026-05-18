package vn.edu.nlu.fit.auction.mapper.Admin.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.nlu.fit.auction.dto.response.Admin.User.AdminUserResponse;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.User;

@Mapper(componentModel = "spring")
public interface AdminUserMapper {

    @Mapping(target = "fullName", source = "profile.fullName")
    @Mapping(target = "phone", source = "profile.phone")
    @Mapping(target = "avatarUrl", source = "profile.avatarUrl")
    @Mapping(target = "job", source = "profile.job")
    @Mapping(target = "bio", source = "profile.bio")
    @Mapping(target = "gender", expression = "java(profile != null && profile.getGender() != null ? profile.getGender().name() : null)")
    @Mapping(target = "provider", expression = "java(user.getProvider() != null ? user.getProvider().name() : null)")

    AdminUserResponse toResponse( User user, Profile profile);
}