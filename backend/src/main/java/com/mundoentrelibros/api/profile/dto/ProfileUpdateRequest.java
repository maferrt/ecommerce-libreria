package com.mundoentrelibros.api.profile.dto;

import com.mundoentrelibros.api.address.dto.AddressRequest;

public record ProfileUpdateRequest(
        String displayName,
        String avatar,
        String currentReading,
        String readerStatus,
        String bio,
        String favoriteGenre,
        AddressRequest address
) {
}