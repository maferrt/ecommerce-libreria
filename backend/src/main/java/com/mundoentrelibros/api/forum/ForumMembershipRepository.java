package com.mundoentrelibros.api.forum;

import com.mundoentrelibros.api.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForumMembershipRepository extends JpaRepository<ForumMembership, Long> {

    Optional<ForumMembership> findByUserAndForum(AppUser user, Forum forum);

    boolean existsByUserAndForum(AppUser user, Forum forum);
}