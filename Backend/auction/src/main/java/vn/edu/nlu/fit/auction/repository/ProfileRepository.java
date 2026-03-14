package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.edu.nlu.fit.auction.entity.Profile;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Integer> {

}
