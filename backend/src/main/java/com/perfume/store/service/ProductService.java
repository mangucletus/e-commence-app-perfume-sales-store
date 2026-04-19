package com.perfume.store.service;

import com.perfume.store.model.Product;
import com.perfume.store.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<Product> findAll(String category, String brand, String search,
                                 BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.findAll(buildSpec(category, brand, search, minPrice, maxPrice), pageable);
    }

    public List<String> findAllBrands() {
        return productRepository.findDistinctBrands();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }

    private Specification<Product> buildSpec(String category, String brand, String search,
                                              BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("category"),
                            Product.Category.valueOf(category.toUpperCase())));
                } catch (IllegalArgumentException ignored) {}
            }

            if (brand != null && !brand.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("brand")), brand.toLowerCase()));
            }

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("brand")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
