package com.gocart.backend.controller;

import com.gocart.backend.dto.ApiResponse;
import com.gocart.backend.model.Store;
import com.gocart.backend.model.User;
import com.gocart.backend.repository.UserRepository;
import com.gocart.backend.security.UserDetailsImpl;
import com.gocart.backend.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores")
@Tag(name = "Stores", description = "Vendor storefront creation and public store listings")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @Operation(summary = "List all approved vendor stores")
    public ResponseEntity<List<Store>> getApprovedStores() {
        return ResponseEntity.ok(storeService.getAllApprovedStores());
    }

    @GetMapping("/{username}")
    @Operation(summary = "Get store details by store username")
    public ResponseEntity<?> getStoreByUsername(@PathVariable String username) {
        return storeService.getStoreByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Register a new vendor store for approval")
    public ResponseEntity<?> createStore(@RequestBody Map<String, String> payload, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail()).orElseThrow();

        Store store = storeService.createStore(
                payload.get("name"),
                payload.get("username"),
                payload.get("description"),
                payload.get("logo"),
                payload.get("email"),
                payload.get("contact"),
                user
        );

        return ResponseEntity.ok(new ApiResponse(true, "Store submitted for admin approval", store));
    }
}

