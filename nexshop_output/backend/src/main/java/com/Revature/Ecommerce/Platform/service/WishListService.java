package com.Revature.Ecommerce.Platform.service;

import com.Revature.Ecommerce.Platform.CustomExceptions.ProductNotFoundException;
import com.Revature.Ecommerce.Platform.CustomExceptions.WishListNotFound;
import com.Revature.Ecommerce.Platform.dto.ProductResponseDTO;
import com.Revature.Ecommerce.Platform.dto.WishlistRequestDTO;
import com.Revature.Ecommerce.Platform.dto.WishlistResponseDTO;
import com.Revature.Ecommerce.Platform.models.Products;
import com.Revature.Ecommerce.Platform.models.Wishlist;
import com.Revature.Ecommerce.Platform.repository.ProductRepository;
import com.Revature.Ecommerce.Platform.repository.WishlistRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WishListService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;

    // Add product to wishlist
    public WishlistResponseDTO addToWishlist(WishlistRequestDTO dto) {

        Long userId = dto.getUserId();
        String productId = dto.getProductId();

        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElse(
                        Wishlist.builder()
                                .userId(userId)
                                .productIds(new ArrayList<>())
                                .build()
                );

        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException("Product not found");
        }

        if (!wishlist.getProductIds().contains(productId)) {
            wishlist.getProductIds().add(productId);
        }

        Wishlist saved = wishlistRepository.save(wishlist);

        return mapToDTO(saved);
    }

    // Remove product from wishlist
    public WishlistResponseDTO removeFromWishlist(WishlistRequestDTO dto) {

        Wishlist wishlist = wishlistRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new WishListNotFound("Wishlist not found"));

        wishlist.getProductIds().remove(dto.getProductId());

        Wishlist saved = wishlistRepository.save(wishlist);

        return mapToDTO(saved);
    }

    // Get wishlist
    public WishlistResponseDTO getWishlist(Long userId) {

        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(() -> new WishListNotFound("Wishlist not found"));

        return mapToDTO(wishlist);
    }

    // Move product from wishlist to cart
    @Transactional
    public void moveToCart(WishlistRequestDTO dto) {

        Long userId = dto.getUserId();
        String productId = dto.getProductId();

        cartService.addToCart(userId, productId, 1);

        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(() -> new WishListNotFound("Wishlist not found"));

        if (!wishlist.getProductIds().contains(productId)) {
            throw new RuntimeException("Product not in wishlist");
        }

        wishlist.getProductIds().remove(productId);

        wishlistRepository.save(wishlist);
    }

    // Convert Entity to DTO
    public WishlistResponseDTO mapToDTO(Wishlist wishlist) {

        List<Products> products = productRepository.findAllById(wishlist.getProductIds());

        List<ProductResponseDTO> productDTOs = products.stream()
                .map(product -> ProductResponseDTO.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .brand(product.getBrand())
                        .inStock(product.getStock() > 0)
                        .build())
                .toList();

        return WishlistResponseDTO.builder()
                .userId(wishlist.getUserId())
                .products(productDTOs)
                .totalItems(productDTOs.size())
                .build();
    }
}