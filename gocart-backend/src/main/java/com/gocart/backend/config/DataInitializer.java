package com.gocart.backend.config;

import com.gocart.backend.model.*;
import com.gocart.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return;

        // 1. Seed Users
        User admin = new User("Platform Admin", "admin@gocart.com", passwordEncoder.encode("admin123"), Role.ROLE_ADMIN);
        User vendor = new User("Tech Zone Vendor", "vendor@gocart.com", passwordEncoder.encode("vendor123"), Role.ROLE_VENDOR);
        User customer = new User("John Doe", "customer@gocart.com", passwordEncoder.encode("customer123"), Role.ROLE_CUSTOMER);

        userRepository.saveAll(List.of(admin, vendor, customer));

        // 2. Seed Store
        Store store = new Store(
                "TechZone Official",
                "techzone",
                "Premier audio, gadgets, and consumer electronics provider.",
                "/happy_store.webp",
                "contact@techzone.com",
                "+1-234-567-8900",
                vendor
        );
        store.setStatus(StoreStatus.APPROVED);
        storeRepository.save(store);

        // 3. Seed Products
        Product p1 = new Product(
                "Wireless Noise-Canceling Headphones",
                "High-fidelity wireless sound with premium active noise cancellation and 40-hour battery life.",
                299.99,
                199.99,
                "Electronics",
                List.of("/product_img1.png", "/product_img2.png"),
                store
        );
        p1.setAverageRating(4.8);
        p1.setRatingCount(124);

        Product p2 = new Product(
                "Fitness Tracker Smartwatch",
                "AMOLED display smartwatch with heart rate monitoring, GPS, and water resistance up to 50m.",
                149.99,
                99.99,
                "Wearables",
                List.of("/product_img3.png"),
                store
        );
        p2.setAverageRating(4.5);
        p2.setRatingCount(89);

        Product p3 = new Product(
                "Ultra HD 4K Mirrorless Camera",
                "Professional mirrorless digital camera with 24.2 MP sensor and ultra-fast autofocus.",
                899.99,
                749.99,
                "Cameras",
                List.of("/product_img4.png"),
                store
        );
        p3.setAverageRating(4.9);
        p3.setRatingCount(56);

        Product p4 = new Product(
                "Ergonomic Mechanical Keyboard",
                "RGB backlit wireless mechanical gaming keyboard with hot-swappable switches.",
                129.99,
                89.99,
                "Accessories",
                List.of("/product_img5.png"),
                store
        );
        p4.setAverageRating(4.7);
        p4.setRatingCount(210);

        Product p5 = new Product(
                "High-Speed USB-C Hub 7-in-1",
                "Aluminum multi-port adapter with HDMI 4K, USB 3.0, and 100W Power Delivery.",
                49.99,
                34.99,
                "Accessories",
                List.of("/product_img6.png"),
                store
        );
        p5.setAverageRating(4.4);
        p5.setRatingCount(78);

        productRepository.saveAll(List.of(p1, p2, p3, p4, p5));

        // 4. Seed Coupon
        Coupon welcomeCoupon = new Coupon("WELCOME20", 20, LocalDate.now().plusMonths(6));
        couponRepository.save(welcomeCoupon);

        System.out.println(">>> GoCart Database Initialized with Sample Seed Data! <<<");
    }
}

