package vn.edu.nlu.fit.auction.repository.Address;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Integer> {
    
}
