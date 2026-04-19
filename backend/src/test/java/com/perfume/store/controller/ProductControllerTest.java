package com.perfume.store.controller;

import com.perfume.store.config.SecurityConfig;
import com.perfume.store.model.Product;
import com.perfume.store.security.JwtUtil;
import com.perfume.store.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@Import(SecurityConfig.class)
@SuppressWarnings("deprecation")
class ProductControllerTest {

    @Autowired MockMvc mockMvc;

    @MockBean ProductService productService;
    @MockBean JwtUtil jwtUtil;
    @MockBean UserDetailsService userDetailsService;

    private Product menProduct;
    private Product womenProduct;

    @BeforeEach
    void setUp() {
        menProduct = new Product();
        menProduct.setId(1L);
        menProduct.setName("Bleu de Chanel");
        menProduct.setBrand("Chanel");
        menProduct.setPrice(new BigDecimal("120.00"));
        menProduct.setCategory(Product.Category.MEN);
        menProduct.setStockQuantity(10);
        menProduct.setDescription("A fresh fragrance");
        menProduct.setSize("100ml");

        womenProduct = new Product();
        womenProduct.setId(2L);
        womenProduct.setName("Coco Mademoiselle");
        womenProduct.setBrand("Chanel");
        womenProduct.setPrice(new BigDecimal("110.00"));
        womenProduct.setCategory(Product.Category.WOMEN);
        womenProduct.setStockQuantity(5);
    }

    @Test
    void getProducts_noFilter_returnsPagedResult() throws Exception {
        Page<Product> page = new PageImpl<>(List.of(menProduct, womenProduct));
        when(productService.findAll(isNull(), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].name").value("Bleu de Chanel"))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    void getProducts_withCategoryFilter_returnsFilteredPage() throws Exception {
        Page<Product> page = new PageImpl<>(List.of(menProduct));
        when(productService.findAll(eq("MEN"), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/products").param("category", "MEN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].category").value("MEN"));
    }

    @Test
    void getProducts_emptyResult_returnsEmptyContent() throws Exception {
        Page<Product> empty = new PageImpl<>(List.of());
        when(productService.findAll(eq("UNISEX"), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(empty);

        mockMvc.perform(get("/api/products").param("category", "UNISEX"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(0))
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    void getProduct_existingId_returns200() throws Exception {
        when(productService.findById(1L)).thenReturn(menProduct);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Bleu de Chanel"))
                .andExpect(jsonPath("$.brand").value("Chanel"));
    }

    @Test
    void getProduct_nonExistingId_returns400WithError() throws Exception {
        when(productService.findById(99L))
                .thenThrow(new IllegalArgumentException("Product not found: 99"));

        mockMvc.perform(get("/api/products/99"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Product not found: 99"));
    }

    @Test
    void getBrands_returnsBrandList() throws Exception {
        when(productService.findAllBrands()).thenReturn(List.of("Chanel", "Dior"));

        mockMvc.perform(get("/api/products/brands"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0]").value("Chanel"));
    }
}
