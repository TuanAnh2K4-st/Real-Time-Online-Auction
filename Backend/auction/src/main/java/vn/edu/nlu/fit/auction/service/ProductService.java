package vn.edu.nlu.fit.auction.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateProductRequest;
import vn.edu.nlu.fit.auction.dto.response.ProductResponse;
import vn.edu.nlu.fit.auction.entity.Category;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.mapper.ProductMapper;
import vn.edu.nlu.fit.auction.repository.CategoryRepository;
import vn.edu.nlu.fit.auction.repository.ProductRepository;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductResponse create(CreateProductRequest req) {

        Product product = productMapper.toEntity(req);

        User currentUser = getCurrentUser();
        product.setUser(currentUser);

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category không tồn tại"));
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);

        return productMapper.toResponse(savedProduct);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
    }
}
