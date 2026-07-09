package com.mundoentrelibros.api.auth.dto;

public record AuthTokenResponse(
    String token,
    AuthUserResponse user
) {
}