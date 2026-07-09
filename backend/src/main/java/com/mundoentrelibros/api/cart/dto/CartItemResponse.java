package com.mundoentrelibros.api.cart.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        String type,
        Long bookId,
        String sagaId,
        String title,
        String author,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal subtotal,
        String coverImage
) {
}