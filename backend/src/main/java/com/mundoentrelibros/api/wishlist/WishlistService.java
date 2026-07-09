package com.mundoentrelibros.api.wishlist;

import com.mundoentrelibros.api.catalog.Book;
import com.mundoentrelibros.api.catalog.BookRepository;
import com.mundoentrelibros.api.catalog.Saga;
import com.mundoentrelibros.api.catalog.SagaRepository;
import com.mundoentrelibros.api.user.AppUser;
import com.mundoentrelibros.api.user.UserRepository;
import com.mundoentrelibros.api.wishlist.dto.WishlistItemResponse;
import com.mundoentrelibros.api.wishlist.dto.WishlistResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final SagaRepository sagaRepository;
    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;

    public WishlistResponse getWishlist(String userEmail) {
        AppUser user = getUserByEmail(userEmail);
        Wishlist wishlist = getOrCreateWishlist(user);

        return toWishlistResponse(wishlist);
    }

    public WishlistResponse addBook(String userEmail, Long bookId) {
        AppUser user = getUserByEmail(userEmail);
        Wishlist wishlist = getOrCreateWishlist(user);

        Book book = bookRepository.findByCatalogIdAndActiveTrue(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Libro no encontrado."));

        boolean alreadyExists = wishlistItemRepository.existsByWishlistAndItemTypeAndBook(
                wishlist,
                WishlistItemType.BOOK,
                book
        );

        if (!alreadyExists) {
            WishlistItem item = WishlistItem.builder()
                    .wishlist(wishlist)
                    .itemType(WishlistItemType.BOOK)
                    .book(book)
                    .saga(null)
                    .build();

            wishlistItemRepository.save(item);
        }

        return toWishlistResponse(wishlist);
    }

    public WishlistResponse addSaga(String userEmail, String sagaSlug) {
        AppUser user = getUserByEmail(userEmail);
        Wishlist wishlist = getOrCreateWishlist(user);

        Saga saga = sagaRepository.findBySlugAndActiveTrue(sagaSlug)
                .orElseThrow(() -> new IllegalArgumentException("Saga no encontrada."));

        boolean alreadyExists = wishlistItemRepository.existsByWishlistAndItemTypeAndSaga(
                wishlist,
                WishlistItemType.SAGA,
                saga
        );

        if (!alreadyExists) {
            WishlistItem item = WishlistItem.builder()
                    .wishlist(wishlist)
                    .itemType(WishlistItemType.SAGA)
                    .book(null)
                    .saga(saga)
                    .build();

            wishlistItemRepository.save(item);
        }

        return toWishlistResponse(wishlist);
    }

    public WishlistResponse removeItem(String userEmail, Long itemId) {
        AppUser user = getUserByEmail(userEmail);
        Wishlist wishlist = getOrCreateWishlist(user);

        WishlistItem item = wishlistItemRepository.findByIdAndWishlist(itemId, wishlist)
                .orElseThrow(() -> new IllegalArgumentException("Elemento no encontrado en favoritos."));

        wishlistItemRepository.delete(item);

        return toWishlistResponse(wishlist);
    }

    private Wishlist getOrCreateWishlist(AppUser user) {
        return wishlistRepository.findByUser(user)
                .orElseGet(() -> {
                    Wishlist newWishlist = Wishlist.builder()
                            .user(user)
                            .build();

                    return wishlistRepository.save(newWishlist);
                });
    }

    private WishlistResponse toWishlistResponse(Wishlist wishlist) {
        List<WishlistItem> items = wishlistItemRepository.findAllByWishlistOrderByCreatedAtDesc(wishlist);

        List<WishlistItemResponse> responseItems = items.stream()
                .map(this::toWishlistItemResponse)
                .toList();

        return new WishlistResponse(
                wishlist.getId(),
                responseItems
        );
    }

    private WishlistItemResponse toWishlistItemResponse(WishlistItem item) {
        if (item.getItemType() == WishlistItemType.BOOK) {
            Book book = item.getBook();

            return new WishlistItemResponse(
                    item.getId(),
                    "BOOK",
                    book.getCatalogId(),
                    null,
                    book.getTitle(),
                    book.getAuthor(),
                    book.getPrice(),
                    book.getCoverImage()
            );
        }

        Saga saga = item.getSaga();

        return new WishlistItemResponse(
                item.getId(),
                "SAGA",
                null,
                saga.getSlug(),
                saga.getName(),
                "Saga",
                saga.getSagaPrice(),
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