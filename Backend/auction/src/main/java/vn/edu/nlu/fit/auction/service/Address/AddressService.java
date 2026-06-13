package vn.edu.nlu.fit.auction.service.Address;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.nlu.fit.auction.dto.request.Address.AddressRequest;
import vn.edu.nlu.fit.auction.entity.Address;
import vn.edu.nlu.fit.auction.entity.Province;
import vn.edu.nlu.fit.auction.entity.Ward;
import vn.edu.nlu.fit.auction.repository.Address.AddressRepository;
import vn.edu.nlu.fit.auction.repository.Address.ProvinceRepository;
import vn.edu.nlu.fit.auction.repository.Address.WardRepository;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ProvinceRepository provinceRepository;
    
    @Autowired
    private WardRepository wardRepository;

    // CREATE
    public Address create(AddressRequest request) {

        Province province = provinceRepository.findById(request.getProvinceId())
                .orElseThrow(() -> new RuntimeException("Province không tồn tại"));

        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new RuntimeException("Ward không tồn tại"));

        Address address = new Address();
        address.setStreet(request.getStreet());
        address.setProvince(province);
        address.setWard(ward);

        return addressRepository.save(address);
    }

    // UPDATE
    public Address update(Integer id, AddressRequest request) {

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address không tồn tại"));

        Province province = provinceRepository.findById(request.getProvinceId())
                .orElseThrow(() -> new RuntimeException("Province không tồn tại"));

        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new RuntimeException("Ward không tồn tại"));

        address.setStreet(request.getStreet());
        address.setProvince(province);
        address.setWard(ward);

        return addressRepository.save(address);
    }

    // DELETE
    public void delete(Integer id) {
        if (!addressRepository.existsById(id)) {
            throw new RuntimeException("Address không tồn tại");
        }
        addressRepository.deleteById(id);
    }
}
