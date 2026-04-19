package com.perfume.store.service;

import com.perfume.store.dto.CheckoutRequest;
import com.perfume.store.dto.OrderDto;
import com.perfume.store.model.Order;
import com.perfume.store.model.Product;
import com.perfume.store.model.User;
import com.perfume.store.repository.OrderRepository;
import com.perfume.store.repository.ProductRepository;
import com.perfume.store.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private ProductRepository productRepository;
    @Mock private UserRepository userRepository;
    @Mock private CartService cartService;

    @InjectMocks private OrderService orderService;

    private User user;
    private Product product;
    private CheckoutRequest checkoutRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("john@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setRole(User.Role.USER);

        product = new Product();
        product.setId(1L);
        product.setName("Bleu de Chanel");
        product.setBrand("Chanel");
        product.setPrice(new BigDecimal("120.00"));
        product.setStockQuantity(10);

        checkoutRequest = new CheckoutRequest();
        checkoutRequest.setShippingAddress("123 Main St, City");
    }

    @Test
    void checkout_validCart_createsOrderAndClearsCart() {
        Map<Object, Object> cartEntries = new HashMap<>();
        cartEntries.put("1", 2);

        Order savedOrder = new Order();
        savedOrder.setId(1L);
        savedOrder.setUser(user);
        savedOrder.setTotalAmount(new BigDecimal("240.00"));
        savedOrder.setShippingAddress("123 Main St, City");
        savedOrder.setStatus(Order.Status.CONFIRMED);
        savedOrder.setItems(new ArrayList<>());

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(cartService.getRawCart("john@example.com")).thenReturn(cartEntries);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        OrderDto result = orderService.checkout("john@example.com", checkoutRequest);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(productRepository).save(product);
        verify(cartService).clearCart("john@example.com");
        assertThat(product.getStockQuantity()).isEqualTo(8);
    }

    @Test
    void checkout_emptyCart_throwsIllegalStateException() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(cartService.getRawCart("john@example.com")).thenReturn(Map.of());

        assertThatThrownBy(() -> orderService.checkout("john@example.com", checkoutRequest))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cart is empty");
        verify(orderRepository, never()).save(any());
    }

    @Test
    void checkout_insufficientStock_throwsIllegalStateException() {
        Map<Object, Object> cartEntries = new HashMap<>();
        cartEntries.put("1", 20);
        product.setStockQuantity(5);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(cartService.getRawCart("john@example.com")).thenReturn(cartEntries);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> orderService.checkout("john@example.com", checkoutRequest))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Insufficient stock");
        verify(cartService, never()).clearCart(any());
    }

    @Test
    void getUserOrders_returnsOrdersSortedByDate() {
        Order order = buildOrder(1L);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByUserOrderByCreatedAtDesc(user)).thenReturn(List.of(order));

        List<OrderDto> orders = orderService.getUserOrders("john@example.com");

        assertThat(orders).hasSize(1);
        assertThat(orders.get(0).getId()).isEqualTo(1L);
    }

    @Test
    void getOrder_validOwner_returnsOrderDto() {
        Order order = buildOrder(1L);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        OrderDto result = orderService.getOrder("john@example.com", 1L);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getOrder_wrongOwner_throwsIllegalArgumentException() {
        Order order = buildOrder(1L);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.getOrder("other@example.com", 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Access denied");
    }

    @Test
    void getOrder_notFound_throwsIllegalArgumentException() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrder("john@example.com", 99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Order not found");
    }

    private Order buildOrder(Long id) {
        Order order = new Order();
        order.setId(id);
        order.setUser(user);
        order.setTotalAmount(new BigDecimal("120.00"));
        order.setStatus(Order.Status.CONFIRMED);
        order.setShippingAddress("123 Main St");
        order.setItems(new ArrayList<>());
        return order;
    }
}
