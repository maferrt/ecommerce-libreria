package com.mundoentrelibros.api.wishlist;

import com.mundoentrelibros.api.catalog.Book;
import com.mundoentrelibros.api.catalog.Saga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findAllByWishlistOrderByCreatedAtDesc(Wishlist wishlist);

    boolean existsByWishlistAndItemTypeAndBook(
            Wishlist wishlist,
            WishlistItemType itemType,
            Book book
    );

    boolean existsByWishlistAndItemTypeAndSaga(
            Wishlist wishlist,
            WishlistItemType itemType,
            Saga saga
    );

    Optional<WishlistItem> findByIdAndWishlist(Long id, Wishlist wishlist);
}