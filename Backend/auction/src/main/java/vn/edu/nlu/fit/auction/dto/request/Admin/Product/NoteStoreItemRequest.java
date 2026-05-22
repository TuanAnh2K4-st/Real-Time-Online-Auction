package vn.edu.nlu.fit.auction.dto.request.Admin.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteStoreItemRequest {
    private Integer storeItemId;
    private StoreItemStatus status;
    private String conditionNote;
}
