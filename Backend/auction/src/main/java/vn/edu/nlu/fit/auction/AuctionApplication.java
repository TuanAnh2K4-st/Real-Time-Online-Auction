package vn.edu.nlu.fit.auction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class AuctionApplication {

	public static void main(String[] args) {
		// Load file .env
        Dotenv dotenv = Dotenv.load();

        // Đưa các biến .env vào System properties để Spring có thể đọc được
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
		SpringApplication.run(AuctionApplication.class, args);
	}

}
