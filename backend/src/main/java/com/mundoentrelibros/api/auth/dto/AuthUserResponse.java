package com.mundoentrelibros.api.auth.dto;

import com.mundoentrelibros.api.user.UserRole;

public record AuthUserResponse(
    Long id,
    String name,
    String email,
    UserRole role
) {
}
