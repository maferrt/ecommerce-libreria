package com.mundoentrelibros.api.auth;

import com.mundoentrelibros.api.auth.dto.AuthTokenResponse;
import com.mundoentrelibros.api.auth.dto.AuthUserResponse;
import com.mundoentrelibros.api.auth.dto.LoginRequest;
import com.mundoentrelibros.api.auth.dto.RegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthTokenResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthTokenResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthTokenResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthTokenResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserResponse> getCurrentUser(
            Authentication authentication
    ) {
        AuthUserResponse response = authService.getCurrentUser(
                authentication.getName()
        );

        return ResponseEntity.ok(response);
    }
}