package com.gocart.backend.controller;

import com.gocart.backend.dto.ApiResponse;
import com.gocart.backend.dto.ProductDTO;
import com.gocart.backend.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Endpoints for browsing, searching, and managing catalog items")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    @Operation(summary = "List all products")
    public ResponseEntity<List<ProductDTO>> getAllProducts(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(productService.getProductsByCategory(category));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_VENDOR', 'ROLE_ADMIN')")
    @Operation(summary = "Create product listing (Vendor/Admin only)")
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO dto, @RequestParam(required = false) Long storeId) {
        ProductDTO created = productService.createProduct(dto, storeId);
        return ResponseEntity.ok(new ApiResponse(true, "Product created successfully", created));
    }
}

