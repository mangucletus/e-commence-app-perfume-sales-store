package com.perfume.store.service;

import com.perfume.store.dto.CheckoutRequest;
import com.perfume.store.dto.OrderDto;
import com.perfume.store.model.Order;
import com.perfume.store.model.OrderItem;
import com.perfume.store.model.Product;
import com.perfume.store.model.User;
import com.perfume.store.repository.OrderRepository;
import com.perfume.store.repository.ProductRepository;
import com.perfume.store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    @Transactional
    public OrderDto checkout(String email, CheckoutRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Map<Object, Object> cartEntries = cartService.getRawCart(email);
        if (cartEntries.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());

        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<Object, Object> entry : cartEntries.entrySet()) {
            Long productId = Long.parseLong(entry.getKey().toString());
            int quantity = ((Number) entry.getValue()).intValue();
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
            if (product.getStockQuantity() < quantity) {
                throw new IllegalStateException("Insufficient stock for: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setPriceAtPurchase(product.getPrice());
            order.getItems().add(item);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);
        cartService.clearCart(email);
        return toDto(saved);
    }

    public List<OrderDto> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toDto).toList();
    }

    public OrderDto getOrder(String email, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (!order.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Access denied");
        }
        return toDto(order);
    }

    private OrderDto toDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setItems(order.getItems().stream().map(item -> {
            OrderDto.OrderItemDto itemDto = new OrderDto.OrderItemDto();
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setBrand(item.getProduct().getBrand());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setPriceAtPurchase(item.getPriceAtPurchase());
            itemDto.setSubtotal(item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity())));
            return itemDto;
        }).toList());
        return dto;
    }
}
