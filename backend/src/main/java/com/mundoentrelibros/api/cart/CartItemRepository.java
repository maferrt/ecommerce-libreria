package com.mundoentrelibros.api.cart;

import com.mundoentrelibros.api.catalog.Book;
import com.mundoentrelibros.api.catalog.Saga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findAllByCartOrderByCreatedAtDesc(Cart cart);

    Optional<CartItem> findByCartAndItemTypeAndBook(
            Cart cart,
            CartItemType itemType,
            Book book
    );

    Optional<CartItem> findByCartAndItemTypeAndSaga(
            Cart cart,
            CartItemType itemType,
            Saga saga
    );

    Optional<CartItem> findByIdAndCart(Long id, Cart cart);

    void deleteAllByCart(Cart cart);
}