package com.perfume.store.service;

import com.perfume.store.dto.CartDto;
import com.perfume.store.dto.CartItemRequest;
import com.perfume.store.model.Product;
import com.perfume.store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ProductRepository productRepository;

    private String cartKey(String email) {
        return "cart:" + email;
    }

    public CartDto getCart(String email) {
        Map<Object, Object> entries = redisTemplate.opsForHash().entries(cartKey(email));
        return buildCartDto(entries);
    }

    public CartDto addItem(String email, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock");
        }
        String key = cartKey(email);
        Object existing = redisTemplate.opsForHash().get(key, String.valueOf(request.getProductId()));
        int current = existing != null ? Integer.parseInt(existing.toString()) : 0;
        redisTemplate.opsForHash().put(key, String.valueOf(request.getProductId()), current + request.getQuantity());
        return getCart(email);
    }

    public CartDto updateItem(String email, Long productId, CartItemRequest request) {
        String key = cartKey(email);
        if (request.getQuantity() <= 0) {
            redisTemplate.opsForHash().delete(key, String.valueOf(productId));
        } else {
            redisTemplate.opsForHash().put(key, String.valueOf(productId), request.getQuantity());
        }
        return getCart(email);
    }

    public CartDto removeItem(String email, Long productId) {
        redisTemplate.opsForHash().delete(cartKey(email), String.valueOf(productId));
        return getCart(email);
    }

    public void clearCart(String email) {
        redisTemplate.delete(cartKey(email));
    }

    public Map<Object, Object> getRawCart(String email) {
        return redisTemplate.opsForHash().entries(cartKey(email));
    }

    private CartDto buildCartDto(Map<Object, Object> entries) {
        List<CartDto.CartItemDto> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Object, Object> entry : entries.entrySet()) {
            Long productId = Long.parseLong(entry.getKey().toString());
            int quantity = Integer.parseInt(entry.getValue().toString());
            productRepository.findById(productId).ifPresent(product -> {
                CartDto.CartItemDto item = new CartDto.CartItemDto();
                item.setProductId(productId);
                item.setProductName(product.getName());
                item.setBrand(product.getBrand());
                item.setImageUrl(product.getImageUrl());
                item.setQuantity(quantity);
                item.setPrice(product.getPrice());
                item.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
                items.add(item);
            });
        }

        BigDecimal cartTotal = items.stream()
                .map(CartDto.CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartDto dto = new CartDto();
        dto.setItems(items);
        dto.setTotal(cartTotal);
        return dto;
    }
}
