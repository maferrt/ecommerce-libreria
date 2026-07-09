package com.mundoentrelibros.api.address;

import com.mundoentrelibros.api.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findByUser(AppUser user);

    Optional<Address> findByUserId(Long userId);
}