package com.gocart.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double ratingValue;

    @Column(length = 1000)
    private String review;

    private LocalDateTime createdAt;

    public Rating() {
        this.createdAt = LocalDateTime.now();
    }

    public Rating(Product product, User user, Double ratingValue, String review) {
        this();
        this.product = product;
        this.user = user;
        this.ratingValue = ratingValue;
        this.review = review;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Double getRatingValue() { return ratingValue; }
    public void setRatingValue(Double ratingValue) { this.ratingValue = ratingValue; }

    public String getReview() { return review; }
    public void setReview(String review) { this.review = review; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

