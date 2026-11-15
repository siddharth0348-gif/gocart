package com.gocart.backend.service;

import com.gocart.backend.dto.OrderDTO;
import com.gocart.backend.model.*;
import com.gocart.backend.repository.OrderRepository;
import com.gocart.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order createOrder(OrderDTO dto, User user) {
        String orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setShippingAddress(dto.getShippingAddress());
        order.setStatus(OrderStatus.ORDER_PLACED);

        double total = 0.0;
        for (OrderDTO.Item item : dto.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));

            double price = product.getOfferPrice() != null ? product.getOfferPrice() : product.getPrice();
            OrderItem orderItem = new OrderItem(order, product, item.getQuantity(), price);
            order.getItems().add(orderItem);
            total += price * item.getQuantity();
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}

