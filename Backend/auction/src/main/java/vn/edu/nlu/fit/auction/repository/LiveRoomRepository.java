package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.edu.nlu.fit.auction.entity.LiveRoom;

@Repository
public interface LiveRoomRepository extends JpaRepository<LiveRoom, Integer>{
    
}
