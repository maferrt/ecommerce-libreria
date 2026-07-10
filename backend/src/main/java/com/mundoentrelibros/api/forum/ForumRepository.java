package com.mundoentrelibros.api.forum;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ForumRepository extends JpaRepository<Forum, Long> {

    List<Forum> findAllByActiveTrueOrderByDisplayOrderAsc();

    Optional<Forum> findBySlugAndActiveTrue(String slug);

    boolean existsBySlug(String slug);
}