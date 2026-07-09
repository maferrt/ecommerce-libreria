package com.mundoentrelibros.api.order.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
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