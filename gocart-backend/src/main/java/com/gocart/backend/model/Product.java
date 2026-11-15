package com.gocart.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double price;

    private Double offerPrice;

    private String category;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    private boolean inStock = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "store_id")
    private Store store;

    private Double averageRating = 0.0;
    private Integer ratingCount = 0;

    private LocalDateTime createdAt;

    public Product() {
        this.createdAt = LocalDateTime.now();
    }

    public Product(String name, String description, Double price, Double offerPrice, String category, List<String> images, Store store) {
        this();
        this.name = name;
        this.description = description;
        this.price = price;
        this.offerPrice = offerPrice;
        this.category = category;
        this.images = images != null ? images : new ArrayList<>();
        this.store = store;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOfferPrice() { return offerPrice; }
    public void setOfferPrice(Double offerPrice) { this.offerPrice = offerPrice; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }

    public Store getStore() { return store; }
    public void setStore(Store store) { this.store = store; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

