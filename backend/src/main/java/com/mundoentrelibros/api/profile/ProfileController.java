package com.mundoentrelibros.api.profile;

import com.mundoentrelibros.api.address.AddressService;
import com.mundoentrelibros.api.address.dto.AddressRequest;
import com.mundoentrelibros.api.address.dto.AddressResponse;
import com.mundoentrelibros.api.profile.dto.ProfileResponse;
import com.mundoentrelibros.api.profile.dto.ProfileUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        ProfileResponse response = profileService.getProfile(authentication.getName());

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody ProfileUpdateRequest request
    ) {
        ProfileResponse response = profileService.updateProfile(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/address")
    public ResponseEntity<AddressResponse> updateAddress(
            Authentication authentication,
            @RequestBody AddressRequest request
    ) {
        AddressResponse response = addressService.updateAddress(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(response);
    }
}