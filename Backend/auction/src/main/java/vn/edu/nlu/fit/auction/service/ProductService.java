package vn.edu.nlu.fit.auction.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateProductRequest;
import vn.edu.nlu.fit.auction.dto.request.FilterProduct;
import vn.edu.nlu.fit.auction.dto.response.ProductAuctionResponse;
import vn.edu.nlu.fit.auction.dto.response.ProductResponse;
import vn.edu.nlu.fit.auction.entity.Category;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.ProductImage;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.mapper.ProductMapper;
import vn.edu.nlu.fit.auction.repository.Category.CategoryRepository;
import vn.edu.nlu.fit.auction.repository.Product.ProductRepository;
import vn.edu.nlu.fit.auction.repository.Store.StoreItemRepository;
import vn.edu.nlu.fit.auction.repository.Store.StoreRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;
import vn.edu.nlu.fit.auction.service.Cloudinary.CloudinaryService;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final StoreItemRepository storeItemRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final CloudinaryService cloudinaryService;
    private final SecurityUtil securityUtil;

    @Transactional
    public void createProduct(CreateProductRequest req) {

        // ===== 1. Validate =====
        if (req.getPrimaryImage() == null || req.getPrimaryImage().isEmpty()) {
            throw new RuntimeException("Phải có ảnh chính");
        }

        // ===== 2. Lấy user từ JWT =====
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        // ===== 3. Lấy category + store =====
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Store store = storeRepository.findById(req.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        // ===== 4. Tạo product từ mapper =====
        Product product = productMapper.toEntity(req);

        product.setUser(currentUser);
        product.setCategory(category);

        // save để có ID
        productRepository.save(product);

        // ===== 5. Upload ảnh =====
        List<ProductImage> images = new ArrayList<>();

        // ảnh chính
        Map<String, String> mainImg = cloudinaryService.uploadFile(req.getPrimaryImage());

        ProductImage primary = new ProductImage();
        primary.setProduct(product);
        primary.setImageUrl(mainImg.get("url"));
        primary.setImagePublicId(mainImg.get("publicId"));
        primary.setIsPrimary(true);

        images.add(primary);

        // ảnh phụ
        if (req.getSubImages() != null) {
            for (MultipartFile file : req.getSubImages()) {

                if (file == null || file.isEmpty()) continue;

                Map<String, String> subImg = cloudinaryService.uploadFile(file);

                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(subImg.get("url"));
                img.setImagePublicId(subImg.get("publicId"));
                img.setIsPrimary(false);

                images.add(img);
            }
        }

        // gán vào product để cascade save
        product.setImages(images);

        // ===== 6. Tạo StoreItem =====
        StoreItem storeItem = new StoreItem();
        storeItem.setProduct(product);
        storeItem.setStore(store);
        storeItem.setItemStatus(StoreItemStatus.PENDING);

        storeItemRepository.save(storeItem);
    }

    // Lọc sản phẩm theo Filter Search và StoreItemStatus
    public List<ProductResponse> filterProducts(FilterProduct filter) {

        // ===== 1. Lấy user từ JWT =====
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Integer userId = currentUser.getUserId();

        // ===== 2. Lấy filter =====
        String name = filter.getProductName();
        StoreItemStatus status = filter.getItemStatus();

        // ===== 3. Xử lý ALL =====
        if (status != null && status.name().equals("ALL")) {
            status = null;
        }

        // ===== 4. Gọi repository =====
        return productRepository.filterProducts(userId, name, status);
    }

    // Danh sách Product cho Create Auction
    public List<ProductAuctionResponse> getProductsForCreateAuction() {

        // ===== 1. Lấy user từ JWT =====
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Integer userId = currentUser.getUserId();

        // ===== 2. Query repository =====
        return productRepository.getProductsForCreateAuction(userId);
    }
    
}