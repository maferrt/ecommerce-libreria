package com.mundoentrelibros.api.order.dto;

public record CheckoutRequest(
        String paymentMethod,
        String deliveryNotes
) {
}