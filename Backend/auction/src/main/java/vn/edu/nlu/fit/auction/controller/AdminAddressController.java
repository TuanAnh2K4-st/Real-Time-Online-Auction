package vn.edu.nlu.fit.auction.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.AddressRequest;
import vn.edu.nlu.fit.auction.entity.Address;
import vn.edu.nlu.fit.auction.service.AddressService;

@RestController
@RequestMapping("/api/admin/addresses")
@RequiredArgsConstructor
public class AdminAddressController {
    
    
    
}
