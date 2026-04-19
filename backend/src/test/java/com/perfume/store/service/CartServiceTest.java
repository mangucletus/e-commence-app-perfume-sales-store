package com.perfume.store.service;

import com.perfume.store.dto.CartDto;
import com.perfume.store.dto.CartItemRequest;
import com.perfume.store.model.Product;
import com.perfume.store.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock private RedisTemplate<String, Object> redisTemplate;
    @Mock private ProductRepository productRepository;
    @Mock private HashOperations<String, Object, Object> hashOperations;

    @InjectMocks private CartService cartService;

    private static final String EMAIL = "john@example.com";
    private static final String CART_KEY = "cart:john@example.com";

    private Product product;

    @BeforeEach
    void setUp() {
        lenient().when(redisTemplate.opsForHash()).thenReturn(hashOperations);

        product = new Product();
        product.setId(1L);
        product.setName("Bleu de Chanel");
        product.setBrand("Chanel");
        product.setPrice(new BigDecimal("120.00"));
        product.setStockQuantity(10);
        product.setImageUrl("https://example.com/img.jpg");
    }

    @Test
    void getCart_emptyCart_returnsEmptyDto() {
        when(hashOperations.entries(CART_KEY)).thenReturn(Map.of());

        CartDto result = cartService.getCart(EMAIL);

        assertThat(result.getItems()).isEmpty();
        assertThat(result.getTotal()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void getCart_withOneItem_returnsCorrectTotals() {
        Map<Object, Object> entries = new HashMap<>();
        entries.put("1", "2");
        when(hashOperations.entries(CART_KEY)).thenReturn(entries);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        CartDto result = cartService.getCart(EMAIL);

        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getItems().get(0).getQuantity()).isEqualTo(2);
        assertThat(result.getTotal()).isEqualByComparingTo(new BigDecimal("240.00"));
    }

    @Test
    void addItem_sufficientStock_putsItemAndReturnsCart() {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(2);

        Map<Object, Object> afterAdd = new HashMap<>();
        afterAdd.put("1", "2");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(hashOperations.get(CART_KEY, "1")).thenReturn(null);
        when(hashOperations.entries(CART_KEY)).thenReturn(afterAdd);

        CartDto result = cartService.addItem(EMAIL, request);

        verify(hashOperations).put(CART_KEY, "1", 2);
        assertThat(result.getItems()).hasSize(1);
    }

    @Test
    void addItem_existingItem_incrementsQuantity() {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(1);

        Map<Object, Object> afterAdd = new HashMap<>();
        afterAdd.put("1", "3");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(hashOperations.get(CART_KEY, "1")).thenReturn("2");
        when(hashOperations.entries(CART_KEY)).thenReturn(afterAdd);

        cartService.addItem(EMAIL, request);

        verify(hashOperations).put(CART_KEY, "1", 3);
    }

    @Test
    void addItem_insufficientStock_throwsIllegalArgumentException() {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(20);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> cartService.addItem(EMAIL, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Insufficient stock");
    }

    @Test
    void addItem_productNotFound_throwsIllegalArgumentException() {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(99L);
        request.setQuantity(1);

        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addItem(EMAIL, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void updateItem_positiveQuantity_updatesHash() {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(3);
        when(hashOperations.entries(CART_KEY)).thenReturn(Map.of());

        cartService.updateItem(EMAIL, 1L, request);

        verify(hashOperations).put(CART_KEY, "1", 3);
    }

    @Test
    void updateItem_zeroQuantity_removesItem() {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(0);
        when(hashOperations.entries(CART_KEY)).thenReturn(Map.of());

        cartService.updateItem(EMAIL, 1L, request);

        verify(hashOperations).delete(CART_KEY, "1");
        verify(hashOperations, never()).put(any(), any(), any());
    }

    @Test
    void removeItem_deletesHashEntry() {
        when(hashOperations.entries(CART_KEY)).thenReturn(Map.of());

        cartService.removeItem(EMAIL, 1L);

        verify(hashOperations).delete(CART_KEY, "1");
    }

    @Test
    void clearCart_deletesCartKey() {
        cartService.clearCart(EMAIL);

        verify(redisTemplate).delete(CART_KEY);
    }

    @Test
    void getRawCart_returnsHashEntries() {
        Map<Object, Object> entries = Map.of("1", "2");
        when(hashOperations.entries(CART_KEY)).thenReturn(entries);

        Map<Object, Object> result = cartService.getRawCart(EMAIL);

        assertThat(result).isEqualTo(entries);
    }
}
