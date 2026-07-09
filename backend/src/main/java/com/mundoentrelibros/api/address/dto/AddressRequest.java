package com.mundoentrelibros.api.address.dto;

public record AddressRequest(
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