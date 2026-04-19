package com.perfume.store.service;

import com.perfume.store.model.Product;
import com.perfume.store.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository productRepository;

    @InjectMocks private ProductService productService;

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

        womenProduct = new Product();
        womenProduct.setId(2L);
        womenProduct.setName("Coco Mademoiselle");
        womenProduct.setBrand("Chanel");
        womenProduct.setPrice(new BigDecimal("110.00"));
        womenProduct.setCategory(Product.Category.WOMEN);
        womenProduct.setStockQuantity(5);
    }

    @Test
    void findAll_nullCategory_returnsAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(menProduct, womenProduct));

        List<Product> result = productService.findAll(null);

        assertThat(result).hasSize(2);
        verify(productRepository).findAll();
        verify(productRepository, never()).findByCategory(any());
    }

    @Test
    void findAll_blankCategory_returnsAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(menProduct, womenProduct));

        List<Product> result = productService.findAll("  ");

        assertThat(result).hasSize(2);
        verify(productRepository).findAll();
    }

    @Test
    void findAll_uppercaseCategory_filtersByCategory() {
        when(productRepository.findByCategory(Product.Category.MEN)).thenReturn(List.of(menProduct));

        List<Product> result = productService.findAll("MEN");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategory()).isEqualTo(Product.Category.MEN);
        verify(productRepository).findByCategory(Product.Category.MEN);
    }

    @Test
    void findAll_lowercaseCategory_handledCaseInsensitively() {
        when(productRepository.findByCategory(Product.Category.WOMEN)).thenReturn(List.of(womenProduct));

        List<Product> result = productService.findAll("women");

        assertThat(result).hasSize(1);
        verify(productRepository).findByCategory(Product.Category.WOMEN);
    }

    @Test
    void findById_existingId_returnsProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(menProduct));

        Product result = productService.findById(1L);

        assertThat(result.getName()).isEqualTo("Bleu de Chanel");
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void findById_nonExistingId_throwsIllegalArgumentException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.findById(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product not found");
    }
}
