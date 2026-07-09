package com.mundoentrelibros.api.order.dto;

import com.mundoentrelibros.api.order.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        OrderStatus status,
        Integer totalItems,
        BigDecimal total,
        String paymentMethod,
        String deliveryNotes,
        ShippingAddressResponse shippingAddress,
        List<OrderItemResponse> items,
        LocalDateTime createdAt
) {
}