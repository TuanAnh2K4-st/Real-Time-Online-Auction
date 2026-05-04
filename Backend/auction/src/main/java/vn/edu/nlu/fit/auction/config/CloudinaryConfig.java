package vn.edu.nlu.fit.auction.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {

    // Lấy giá trị từ file application.properties
    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        // B1: Tạo Map chứa config kết nối
        Map<String, String> config = new HashMap<>();
        // Gán các thông tin xác thực từ file config vào Map
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        // B2: Khởi tạo và trả về đối tượng Cloudinary với config trên
        return new Cloudinary(config);
    }
}
