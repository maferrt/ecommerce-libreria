package com.mundoentrelibros.api.auth;

import com.mundoentrelibros.api.auth.dto.AuthTokenResponse;
import com.mundoentrelibros.api.auth.dto.AuthUserResponse;
import com.mundoentrelibros.api.auth.dto.LoginRequest;
import com.mundoentrelibros.api.auth.dto.RegisterRequest;
import com.mundoentrelibros.api.user.AppUser;
import com.mundoentrelibros.api.user.UserRepository;
import com.mundoentrelibros.api.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthTokenResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        if (!request.password().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden.");
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Ya existe una cuenta con ese correo.");
        }

        AppUser newUser = AppUser.builder()
                .name(request.name().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(UserRole.USER)
                .build();

        AppUser savedUser = userRepository.save(newUser);

        return buildTokenResponse(savedUser);
    }

    public AuthTokenResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        AppUser user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Correo o contraseña incorrectos."));

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
        );

        if (!passwordMatches) {
            throw new IllegalArgumentException("Correo o contraseña incorrectos.");
        }

        return buildTokenResponse(user);
    }

    public AuthUserResponse getCurrentUser(String email) {
        AppUser user = userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        return toAuthUserResponse(user);
    }

    private AuthTokenResponse buildTokenResponse(AppUser user) {
        String token = jwtService.generateToken(user);

        return new AuthTokenResponse(
                token,
                toAuthUserResponse(user)
        );
    }

    private AuthUserResponse toAuthUserResponse(AppUser user) {
        return new AuthUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}