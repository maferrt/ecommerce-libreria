package com.mundoentrelibros.api.cart;

import com.mundoentrelibros.api.cart.dto.CartItemQuantityRequest;
import com.mundoentrelibros.api.cart.dto.CartItemResponse;
import com.mundoentrelibros.api.cart.dto.CartResponse;
import com.mundoentrelibros.api.catalog.Book;
import com.mundoentrelibros.api.catalog.BookRepository;
import com.mundoentrelibros.api.catalog.Saga;
import com.mundoentrelibros.api.catalog.SagaRepository;
import com.mundoentrelibros.api.user.AppUser;
import com.mundoentrelibros.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final SagaRepository sagaRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartResponse getCart(String userEmail) {
        AppUser user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse addBook(String userEmail, Long bookId) {
        AppUser user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        Book book = bookRepository.findByCatalogIdAndActiveTrue(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Libro no encontrado."));

        CartItem item = cartItemRepository.findByCartAndItemTypeAndBook(
                        cart,
                        CartItemType.BOOK,
                        book
                )
                .orElse(null);

        if (item == null) {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .itemType(CartItemType.BOOK)
                    .book(book)
                    .saga(null)
                    .quantity(1)
                    .build();

            cartItemRepository.save(newItem);
        } else {
            item.setQuantity(item.getQuantity() + 1);
            cartItemRepository.save(item);
        }

        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse addSaga(String userEmail, String sagaSlug) {
        AppUser user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        Saga saga = sagaRepository.findBySlugAndActiveTrue(sagaSlug)
                .orElseThrow(() -> new IllegalArgumentException("Saga no encontrada."));

        CartItem item = cartItemRepository.findByCartAndItemTypeAndSaga(
                        cart,
                        CartItemType.SAGA,
                        saga
                )
                .orElse(null);

        if (item == null) {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .itemType(CartItemType.SAGA)
                    .book(null)
                    .saga(saga)
                    .quantity(1)
                    .build();

            cartItemRepository.save(newItem);
        } else {
            item.setQuantity(item.getQuantity() + 1);
            cartItemRepository.save(item);
        }

        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse updateItemQuantity(
            String userEmail,
            Long itemId,
            CartItemQuantityRequest request
    ) {
        AppUser user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findByIdAndCart(itemId, cart)
                .orElseThrow(() -> new IllegalArgumentException("Elemento no encontrado en el carrito."));

        item.setQuantity(request.quantity());

        cartItemRepository.save(item);

        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(String userEmail, Long itemId) {
        AppUser user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findByIdAndCart(itemId, cart)
                .orElseThrow(() -> new IllegalArgumentException("Elemento no encontrado en el carrito."));

        cartItemRepository.delete(item);

        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse clearCart(String userEmail) {
        AppUser user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        cartItemRepository.deleteAllByCart(cart);

        return toCartResponse(cart);
    }

    public Cart getOrCreateCart(AppUser user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(user)
                            .build();

                    return cartRepository.save(newCart);
                });
    }

    public CartResponse toCartResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findAllByCartOrderByCreatedAtDesc(cart);

        List<CartItemResponse> responseItems = items.stream()
                .map(this::toCartItemResponse)
                .toList();

        Integer totalItems = responseItems.stream()
                .map(CartItemResponse::quantity)
                .reduce(0, Integer::sum);

        BigDecimal total = responseItems.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(
                cart.getId(),
                responseItems,
                totalItems,
                total
        );
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        if (item.getItemType() == CartItemType.BOOK) {
            Book book = item.getBook();

            BigDecimal subtotal = book.getPrice().multiply(
                    BigDecimal.valueOf(item.getQuantity())
            );

            return new CartItemResponse(
                    item.getId(),
                    "BOOK",
                    book.getCatalogId(),
                    null,
                    book.getTitle(),
                    book.getAuthor(),
                    book.getPrice(),
                    item.getQuantity(),
                    subtotal,
                    book.getCoverImage()
            );
        }

        Saga saga = item.getSaga();

        BigDecimal subtotal = saga.getSagaPrice().multiply(
                BigDecimal.valueOf(item.getQuantity())
        );

        return new CartItemResponse(
                item.getId(),
                "SAGA",
                null,
                saga.getSlug(),
                saga.getName(),
                "Saga",
                saga.getSagaPrice(),
                item.getQuantity(),
                subtotal,
                saga.getCoverImage()
        );
    }

    private AppUser getUserByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}