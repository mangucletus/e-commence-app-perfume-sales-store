package com.perfume.store.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.perfume.store.config.SecurityConfig;
import com.perfume.store.dto.CheckoutRequest;
import com.perfume.store.dto.OrderDto;
import com.perfume.store.model.Order;
import com.perfume.store.security.JwtUtil;
import com.perfume.store.service.OrderService;
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
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@Import(SecurityConfig.class)
class OrderControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean OrderService orderService;
    @MockBean JwtUtil jwtUtil;
    @MockBean UserDetailsService userDetailsService;

    @Test
    @WithMockUser(username = "test@example.com")
    void checkout_validRequest_returns200WithOrder() throws Exception {
        CheckoutRequest req = new CheckoutRequest();
        req.setShippingAddress("123 Main St");

        OrderDto order = buildOrderDto(1L, Order.Status.CONFIRMED);
        when(orderService.checkout(eq("test@example.com"), any())).thenReturn(order);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void checkout_blankAddress_returns400() throws Exception {
        CheckoutRequest req = new CheckoutRequest();
        req.setShippingAddress("  ");

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void checkout_emptyCart_returns409() throws Exception {
        CheckoutRequest req = new CheckoutRequest();
        req.setShippingAddress("123 Main St");
        when(orderService.checkout(any(), any()))
                .thenThrow(new IllegalStateException("Cart is empty"));

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Cart is empty"));
    }

    @Test
    void checkout_unauthenticated_returns401() throws Exception {
        CheckoutRequest req = new CheckoutRequest();
        req.setShippingAddress("123 Main St");

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getOrders_authenticated_returnsOrderList() throws Exception {
        OrderDto order = buildOrderDto(1L, Order.Status.CONFIRMED);
        when(orderService.getUserOrders("test@example.com")).thenReturn(List.of(order));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getOrders_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getOrder_existingId_returns200() throws Exception {
        OrderDto order = buildOrderDto(1L, Order.Status.CONFIRMED);
        when(orderService.getOrder("test@example.com", 1L)).thenReturn(order);

        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void getOrder_wrongOwner_returns400() throws Exception {
        when(orderService.getOrder(any(), eq(1L)))
                .thenThrow(new IllegalArgumentException("Access denied"));

        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Access denied"));
    }

    private OrderDto buildOrderDto(Long id, Order.Status status) {
        OrderDto dto = new OrderDto();
        dto.setId(id);
        dto.setTotalAmount(new BigDecimal("120.00"));
        dto.setStatus(status);
        dto.setShippingAddress("123 Main St");
        dto.setItems(new ArrayList<>());
        return dto;
    }
}
