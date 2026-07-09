package com.mundoentrelibros.api.wishlist;

import com.mundoentrelibros.api.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    Optional<Wishlist> findByUser(AppUser user);

    Optional<Wishlist> findByUserId(Long userId);
}