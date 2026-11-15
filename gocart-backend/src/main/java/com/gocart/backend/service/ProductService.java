package com.gocart.backend.service;

import com.gocart.backend.dto.ProductDTO;
import com.gocart.backend.model.Product;
import com.gocart.backend.model.Store;
import com.gocart.backend.repository.ProductRepository;
import com.gocart.backend.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StoreRepository storeRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id).map(this::convertToDTO);
    }

    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String query) {
        return productRepository.searchProducts(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO dto, Long storeId) {
        Store store = storeId != null ? storeRepository.findById(storeId).orElse(null) : null;

        Product product = new Product(
                dto.getName(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getOfferPrice(),
                dto.getCategory(),
                dto.getImages(),
                store
        );

        Product saved = productRepository.save(product);
        return convertToDTO(saved);
    }

    public ProductDTO convertToDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setOfferPrice(p.getOfferPrice());
        dto.setCategory(p.getCategory());
        dto.setImages(p.getImages());
        dto.setInStock(p.isInStock());
        dto.setAverageRating(p.getAverageRating());
        dto.setRatingCount(p.getRatingCount());
        if (p.getStore() != null) {
            dto.setStoreId(p.getStore().getId());
            dto.setStoreName(p.getStore().getName());
        }
        return dto;
    }
}

