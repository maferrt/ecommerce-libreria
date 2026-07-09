package com.mundoentrelibros.api.profile;

import com.mundoentrelibros.api.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUser(AppUser user);

    Optional<UserProfile> findByUserId(Long userId);
}