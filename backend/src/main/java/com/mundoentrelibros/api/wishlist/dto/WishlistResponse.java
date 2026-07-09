package com.mundoentrelibros.api.wishlist.dto;

import java.util.List;

public record WishlistResponse(
        Long id,
        List<WishlistItemResponse> items
) {
}