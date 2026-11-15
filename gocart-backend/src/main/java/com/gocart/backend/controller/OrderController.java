package com.gocart.backend.controller;

import com.gocart.backend.dto.ApiResponse;
import com.gocart.backend.dto.OrderDTO;
import com.gocart.backend.model.Order;
import com.gocart.backend.model.User;
import com.gocart.backend.repository.UserRepository;
import com.gocart.backend.security.UserDetailsImpl;
import com.gocart.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order placement and customer order tracking")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get order history for authenticated customer")
    public ResponseEntity<List<Order>> getMyOrders(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail()).orElseThrow();
        return ResponseEntity.ok(orderService.getOrdersByUser(user));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Place a new customer order")
    public ResponseEntity<?> placeOrder(@RequestBody OrderDTO dto, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail()).orElseThrow();

        Order order = orderService.createOrder(dto, user);
        return ResponseEntity.ok(new ApiResponse(true, "Order placed successfully", order));
    }
}

