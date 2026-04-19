package com.perfume.store.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.perfume.store.config.SecurityConfig;
import com.perfume.store.dto.CartDto;
import com.perfume.store.dto.CartItemRequest;
import com.perfume.store.security.JwtUtil;
import com.perfume.store.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CartController.class)
@Import(SecurityConfig.class)
class CartControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean CartService cartService;
    @MockBean JwtUtil jwtUtil;
    @MockBean UserDetailsService userDetailsService;

    private CartDto emptyCart;

    @BeforeEach
    void setUp() {
        emptyCart = new CartDto();
        emptyCart.setItems(List.of());
        emptyCart.setTotal(BigDecimal.ZERO);
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getCart_authenticated_returns200() throws Exception {
        when(cartService.getCart("test@example.com")).thenReturn(emptyCart);

        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.total").value(0));
    }

    @Test
    void getCart_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void addItem_validRequest_returns200() throws Exception {
        CartItemRequest req = new CartItemRequest();
        req.setProductId(1L);
        req.setQuantity(2);
        when(cartService.addItem(eq("test@example.com"), any())).thenReturn(emptyCart);

        mockMvc.perform(post("/api/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
        verify(cartService).addItem(eq("test@example.com"), any());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void addItem_invalidQuantity_returns400() throws Exception {
        CartItemRequest req = new CartItemRequest();
        req.setProductId(1L);
        req.setQuantity(0);

        mockMvc.perform(post("/api/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void updateItem_validRequest_returns200() throws Exception {
        CartItemRequest req = new CartItemRequest();
        req.setProductId(1L);
        req.setQuantity(3);
        when(cartService.updateItem(eq("test@example.com"), eq(1L), any())).thenReturn(emptyCart);

        mockMvc.perform(put("/api/cart/items/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void removeItem_returns200() throws Exception {
        when(cartService.removeItem("test@example.com", 1L)).thenReturn(emptyCart);

        mockMvc.perform(delete("/api/cart/items/1"))
                .andExpect(status().isOk());
        verify(cartService).removeItem("test@example.com", 1L);
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void clearCart_returns204() throws Exception {
        mockMvc.perform(delete("/api/cart"))
                .andExpect(status().isNoContent());
        verify(cartService).clearCart("test@example.com");
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void addItem_insufficientStock_returns400() throws Exception {
        CartItemRequest req = new CartItemRequest();
        req.setProductId(1L);
        req.setQuantity(2);
        when(cartService.addItem(any(), any()))
                .thenThrow(new IllegalArgumentException("Insufficient stock"));

        mockMvc.perform(post("/api/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Insufficient stock"));
    }
}
