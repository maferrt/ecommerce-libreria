package com.mundoentrelibros.api.address.dto;

public record AddressResponse(
        Long id,
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