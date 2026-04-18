package com.perfume.store.controller;

import com.perfume.store.dto.CheckoutRequest;
import com.perfume.store.dto.OrderDto;
import com.perfume.store.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> checkout(@AuthenticationPrincipal UserDetails user,
                                             @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(orderService.checkout(user.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrders(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.getUserOrders(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrder(@AuthenticationPrincipal UserDetails user,
                                             @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(user.getUsername(), id));
    }
}
