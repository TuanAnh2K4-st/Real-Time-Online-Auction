package vn.edu.nlu.fit.auction.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateProductRequest;
import vn.edu.nlu.fit.auction.dto.response.ProductResponse;
import vn.edu.nlu.fit.auction.entity.Category;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.mapper.ProductMapper;
import vn.edu.nlu.fit.auction.repository.CategoryRepository;
import vn.edu.nlu.fit.auction.repository.ProductRepository;
import vn.edu.nlu.fit.auction.repository.StoreItemRepository;
import vn.edu.nlu.fit.auction.repository.StoreRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final StoreRepository storeRepository;
    private final StoreItemRepository storeItemRepository;
    private final SecurityUtil securityUtil;

    public ProductResponse create(CreateProductRequest req) {

        // Map request -> Product
        Product product = productMapper.toEntity(req);

        // Set user
        User currentUser = securityUtil.getCurrentUser();
        product.setUser(currentUser);

        // Set category
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category không tồn tại"));
        product.setCategory(category);

        // Save product
        Product savedProduct = productRepository.save(product);

        // TẠO STORE ITEM
     

        Store store = storeRepository.findById(req.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store không tồn tại"));

        StoreItem storeItem = new StoreItem();
        storeItem.setProduct(savedProduct);
        storeItem.setStore(store);
        storeItem.setItemStatus(StoreItemStatus.PENDING);
        storeItem.setConditionNote(null);

        storeItemRepository.save(storeItem);

        return productMapper.toResponse(savedProduct);
    }
}
