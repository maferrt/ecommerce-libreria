package com.mundoentrelibros.api.order.dto;

public record ShippingAddressResponse(
        String street,
        String exteriorNumber,
        String interiorNumber,
        String neighborhood,
        String city,
        String state,
        String zipCode,
        String country,
        String references
) {
}