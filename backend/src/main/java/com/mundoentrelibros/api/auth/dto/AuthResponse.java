package com.mundoentrelibros.api.auth.dto;

import com.mundoentrelibros.api.user.UserRole;

public record AuthResponse(
        Long id,
        String name,
        String email,
        UserRole role
) {
}