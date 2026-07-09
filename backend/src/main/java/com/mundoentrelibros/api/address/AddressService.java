package com.mundoentrelibros.api.address;

import com.mundoentrelibros.api.address.dto.AddressRequest;
import com.mundoentrelibros.api.address.dto.AddressResponse;
import com.mundoentrelibros.api.user.AppUser;
import com.mundoentrelibros.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public Address getOrCreateAddress(AppUser user) {
        return addressRepository.findByUser(user)
                .orElseGet(() -> {
                    Address newAddress = Address.builder()
                            .user(user)
                            .street("")
                            .exteriorNumber("")
                            .interiorNumber("")
                            .neighborhood("")
                            .city("")
                            .state("")
                            .zipCode("")
                            .country("México")
                            .references("")
                            .build();

                    return addressRepository.save(newAddress);
                });
    }

    public AddressResponse updateAddress(String userEmail, AddressRequest request) {
        AppUser user = userRepository.findByEmail(normalizeEmail(userEmail))
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        Address address = getOrCreateAddress(user);

        applyAddressChanges(address, request);

        Address savedAddress = addressRepository.save(address);

        return toAddressResponse(savedAddress);
    }

    public Address applyAddressChanges(Address address, AddressRequest request) {
        address.setStreet(clean(request.street()));
        address.setExteriorNumber(clean(request.exteriorNumber()));
        address.setInteriorNumber(clean(request.interiorNumber()));
        address.setNeighborhood(clean(request.neighborhood()));
        address.setCity(clean(request.city()));
        address.setState(clean(request.state()));
        address.setZipCode(clean(request.zipCode()));
        address.setCountry(cleanOrDefault(request.country(), "México"));
        address.setReferences(clean(request.references()));

        return address;
    }

    public Address save(Address address) {
        return addressRepository.save(address);
    }


    public AddressResponse toAddressResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getStreet(),
                address.getExteriorNumber(),
                address.getInteriorNumber(),
                address.getNeighborhood(),
                address.getCity(),
                address.getState(),
                address.getZipCode(),
                address.getCountry(),
                address.getReferences()
        );
    }

    private String clean(String value) {
        if (value == null) {
            return "";
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

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}