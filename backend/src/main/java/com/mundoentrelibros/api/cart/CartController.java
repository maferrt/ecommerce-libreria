package com.mundoentrelibros.api.cart;

import com.mundoentrelibros.api.cart.dto.CartItemQuantityRequest;
import com.mundoentrelibros.api.cart.dto.CartResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        CartResponse response = cartService.getCart(authentication.getName());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/books/{bookId}")
    public ResponseEntity<CartResponse> addBook(
            Authentication authentication,
            @PathVariable Long bookId
    ) {
        CartResponse response = cartService.addBook(
                authentication.getName(),
                bookId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/sagas/{sagaSlug}")
    public ResponseEntity<CartResponse> addSaga(
            Authentication authentication,
            @PathVariable String sagaSlug
    ) {
        CartResponse response = cartService.addSaga(
                authentication.getName(),
                sagaSlug
        );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateItemQuantity(
            Authentication authentication,
            @PathVariable Long itemId,
            @Valid @RequestBody CartItemQuantityRequest request
    ) {
        CartResponse response = cartService.updateItemQuantity(
                authentication.getName(),
                itemId,
                request
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(
            Authentication authentication,
            @PathVariable Long itemId
    ) {
        CartResponse response = cartService.removeItem(
                authentication.getName(),
                itemId
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<CartResponse> clearCart(Authentication authentication) {
        CartResponse response = cartService.clearCart(authentication.getName());

        return ResponseEntity.ok(response);
    }
}