package com.perfume.store.service;

import com.perfume.store.model.Product;
import com.perfume.store.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository productRepository;

    @InjectMocks private ProductService productService;

    private Product menProduct;
    private Product womenProduct;
    private Pageable defaultPageable;

    @BeforeEach
    void setUp() {
        defaultPageable = PageRequest.of(0, 12);

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
    void findAll_noFilters_returnsAllProducts() {
        Page<Product> page = new PageImpl<>(List.of(menProduct, womenProduct));
        when(productRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<Product> result = productService.findAll(null, null, null, null, null, defaultPageable);

        assertThat(result.getTotalElements()).isEqualTo(2);
        verify(productRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void findAll_withCategory_delegatesToRepository() {
        Page<Product> page = new PageImpl<>(List.of(menProduct));
        when(productRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<Product> result = productService.findAll("MEN", null, null, null, null, defaultPageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(productRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void findAll_withSearch_delegatesToRepository() {
        Page<Product> page = new PageImpl<>(List.of(menProduct));
        when(productRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<Product> result = productService.findAll(null, null, "chanel", null, null, defaultPageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
    }

    @Test
    void findAll_withPriceRange_delegatesToRepository() {
        Page<Product> page = new PageImpl<>(List.of(menProduct));
        when(productRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<Product> result = productService.findAll(null, null, null,
                new BigDecimal("100"), new BigDecimal("150"), defaultPageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
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

    @Test
    void findAllBrands_returnsBrandsFromRepository() {
        when(productRepository.findDistinctBrands()).thenReturn(List.of("Chanel", "Dior"));

        List<String> brands = productService.findAllBrands();

        assertThat(brands).containsExactly("Chanel", "Dior");
    }
}
