package com.mundoentrelibros.api.profile.dto;

import com.mundoentrelibros.api.address.dto.AddressResponse;

public record ProfileResponse(
        Long id,
        Long userId,
        String email,
        String displayName,
        String avatar,
        String currentReading,
        String readerStatus,
        String bio,
        String favoriteGenre,
        AddressResponse address
) {
}