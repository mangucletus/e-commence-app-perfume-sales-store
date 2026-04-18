package com.perfume.store.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CartDto {
    private List<CartItemDto> items;
    private BigDecimal total;

    @Data
    public static class CartItemDto {
        private Long productId;
        private String productName;
        private String brand;
        private String imageUrl;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
    }
}
