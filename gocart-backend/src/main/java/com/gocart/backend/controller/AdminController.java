package com.gocart.backend.controller;

import com.gocart.backend.dto.ApiResponse;
import com.gocart.backend.model.Store;
import com.gocart.backend.model.StoreStatus;
import com.gocart.backend.service.OrderService;
import com.gocart.backend.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Platform management and moderation endpoints")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    @Autowired
    private StoreService storeService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/stores/pending")
    @Operation(summary = "List pending store applications awaiting moderation")
    public ResponseEntity<List<Store>> getPendingStores() {
        return ResponseEntity.ok(storeService.getAllPendingStores());
    }

    @PatchMapping("/stores/{id}/status")
    @Operation(summary = "Approve or reject a vendor store application")
    public ResponseEntity<?> updateStoreStatus(@PathVariable Long id, @RequestParam StoreStatus status) {
        Store updated = storeService.updateStoreStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Store status updated to " + status, updated));
    }

    @GetMapping("/stats")
    @Operation(summary = "Platform-wide summary metrics")
    public ResponseEntity<?> getPlatformStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStores", storeService.getAllApprovedStores().size());
        stats.put("pendingApprovals", storeService.getAllPendingStores().size());
        stats.put("totalOrders", orderService.getAllOrders().size());
        return ResponseEntity.ok(stats);
    }
}

