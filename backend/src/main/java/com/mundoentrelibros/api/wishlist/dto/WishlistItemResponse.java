package com.mundoentrelibros.api.wishlist.dto;

import java.math.BigDecimal;

public record WishlistItemResponse(
        Long id,
        String type,
        Long bookId,
        String sagaId,
        String title,
        String author,
        BigDecimal price,
        String coverImage
) {
}