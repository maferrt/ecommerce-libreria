package com.mundoentrelibros.api.profile;

import com.mundoentrelibros.api.address.Address;
import com.mundoentrelibros.api.address.AddressService;
import com.mundoentrelibros.api.address.dto.AddressRequest;
import com.mundoentrelibros.api.profile.dto.ProfileResponse;
import com.mundoentrelibros.api.profile.dto.ProfileUpdateRequest;
import com.mundoentrelibros.api.user.AppUser;
import com.mundoentrelibros.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final AddressService addressService;

    public ProfileResponse getProfile(String userEmail) {
        AppUser user = getUserByEmail(userEmail);
        UserProfile profile = getOrCreateProfile(user);
        Address address = addressService.getOrCreateAddress(user);

        return toProfileResponse(profile, address);
    }

    public ProfileResponse updateProfile(String userEmail, ProfileUpdateRequest request) {
        AppUser user = getUserByEmail(userEmail);
        UserProfile profile = getOrCreateProfile(user);
        Address address = addressService.getOrCreateAddress(user);

        profile.setDisplayName(cleanOrDefault(request.displayName(), user.getName()));
        profile.setAvatar(cleanNullable(request.avatar()));
        profile.setCurrentReading(clean(request.currentReading()));
        profile.setReaderStatus(cleanOrDefault(request.readerStatus(), "Buscando nueva lectura"));
        profile.setBio(cleanOrDefault(request.bio(), "Lector/a de Mundo Entre Libros."));
        profile.setFavoriteGenre(cleanOrDefault(request.favoriteGenre(), "Novela Juvenil"));

        UserProfile savedProfile = userProfileRepository.save(profile);

        AddressRequest addressRequest = request.address();

        if (addressRequest != null) {
            addressService.applyAddressChanges(address, addressRequest);
            address = addressService.save(address);
        }

        return toProfileResponse(savedProfile, address);
    }

    private UserProfile getOrCreateProfile(AppUser user) {
        return userProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    UserProfile newProfile = UserProfile.builder()
                            .user(user)
                            .displayName(user.getName())
                            .avatar(null)
                            .currentReading("")
                            .readerStatus("Buscando nueva lectura")
                            .bio("Lector/a de Mundo Entre Libros.")
                            .favoriteGenre("Novela Juvenil")
                            .build();

                    return userProfileRepository.save(newProfile);
                });
    }

    private ProfileResponse toProfileResponse(UserProfile profile, Address address) {
        return new ProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getUser().getEmail(),
                profile.getDisplayName(),
                profile.getAvatar(),
                profile.getCurrentReading(),
                profile.getReaderStatus(),
                profile.getBio(),
                profile.getFavoriteGenre(),
                addressService.toAddressResponse(address)
        );
    }

    private AppUser getUserByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String clean(String value) {
        if (value == null) {
            return "";
        }

        return value.trim();
    }

    private String cleanNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String cleanOrDefault(String value, String defaultValue) {
        String cleanedValue = clean(value);

        if (cleanedValue.isBlank()) {
            return defaultValue;
        }

        return cleanedValue;
    }
}