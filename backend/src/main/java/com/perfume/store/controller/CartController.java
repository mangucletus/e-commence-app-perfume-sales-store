package com.perfume.store.controller;

import com.perfume.store.dto.CartDto;
import com.perfume.store.dto.CartItemRequest;
import com.perfume.store.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getCart(user.getUsername()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItem(@AuthenticationPrincipal UserDetails user,
                                           @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(user.getUsername(), request));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartDto> updateItem(@AuthenticationPrincipal UserDetails user,
                                              @PathVariable Long productId,
                                              @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItem(user.getUsername(), productId, request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartDto> removeItem(@AuthenticationPrincipal UserDetails user,
                                              @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItem(user.getUsername(), productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails user) {
        cartService.clearCart(user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
