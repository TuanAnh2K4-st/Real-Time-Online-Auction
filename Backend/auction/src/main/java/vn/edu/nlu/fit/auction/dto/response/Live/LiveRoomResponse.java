package vn.edu.nlu.fit.auction.dto.response.Live;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.nlu.fit.auction.enums.RoomStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveRoomResponse {

    private Integer roomId;
    private String roomCode;
    private String roomName;
    private RoomStatus roomStatus;
}
