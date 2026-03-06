package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import vn.edu.nlu.fit.auction.enums.RoomStatus;

@Entity
@Table(name = "live_rooms")
public class LiveRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @Column(name = "room_name", length = 150)
    private String roomName;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    //Constructor
    public LiveRoom() {
    }

    //Getters and Setters
    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }
}