package com.perfume.store.service;

import com.perfume.store.model.Product;
import com.perfume.store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> findAll(String category) {
        if (category != null && !category.isBlank()) {
            return productRepository.findByCategory(Product.Category.valueOf(category.toUpperCase()));
        }
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }
}
