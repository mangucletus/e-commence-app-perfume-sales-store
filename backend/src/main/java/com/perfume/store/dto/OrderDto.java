package com.perfume.store.dto;

import com.perfume.store.model.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private BigDecimal totalAmount;
    private Order.Status status;
    private LocalDateTime createdAt;
    private String shippingAddress;
    private List<OrderItemDto> items;

    @Data
    public static class OrderItemDto {
        private Long productId;
        private String productName;
        private String brand;
        private Integer quantity;
        private BigDecimal priceAtPurchase;
        private BigDecimal subtotal;
    }
}
