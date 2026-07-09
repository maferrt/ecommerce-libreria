package com.mundoentrelibros.api.wishlist;

import com.mundoentrelibros.api.wishlist.dto.WishlistResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<WishlistResponse> getWishlist(Authentication authentication) {
        WishlistResponse response = wishlistService.getWishlist(authentication.getName());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/books/{bookId}")
    public ResponseEntity<WishlistResponse> addBook(
            Authentication authentication,
            @PathVariable Long bookId
    ) {
        WishlistResponse response = wishlistService.addBook(
                authentication.getName(),
                bookId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/sagas/{sagaSlug}")
    public ResponseEntity<WishlistResponse> addSaga(
            Authentication authentication,
            @PathVariable String sagaSlug
    ) {
        WishlistResponse response = wishlistService.addSaga(
                authentication.getName(),
                sagaSlug
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<WishlistResponse> removeItem(
            Authentication authentication,
            @PathVariable Long itemId
    ) {
        WishlistResponse response = wishlistService.removeItem(
                authentication.getName(),
                itemId
        );

        return ResponseEntity.ok(response);
    }
}