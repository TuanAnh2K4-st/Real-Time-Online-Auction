package vn.edu.nlu.fit.auction.service.Admin.Product;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.Product.ProductFilterRequest;
import vn.edu.nlu.fit.auction.dto.response.Admin.Product.AdminProductResponse;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.mapper.Admin.Product.AdminProductMapper;
import vn.edu.nlu.fit.auction.repository.Store.StoreItemRepository;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final StoreItemRepository storeItemRepository;

    private final AdminProductMapper adminProductMapper;

    public List<AdminProductResponse> filterProducts( ProductFilterRequest request ) {

        Specification<StoreItem> specification =
                StoreItemSpecification.filterProducts(
                        request.getKeyword(),
                        request.getItemStatus()
                );

        List<StoreItem> storeItems =
                storeItemRepository.findAll(specification);

        return storeItems.stream()
                .map(adminProductMapper::toResponse)
                .toList();
    }
}
