package vn.edu.nlu.fit.auction.dto.request.Admin.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.nlu.fit.auction.enums.UserRole;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFilterRequest {

    private String keyword;

    private UserRole role;
}
