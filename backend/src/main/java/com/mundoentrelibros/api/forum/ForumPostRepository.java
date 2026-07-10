package com.mundoentrelibros.api.forum;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {

    List<ForumPost> findAllByForumAndActiveTrueOrderByCreatedAtDesc(Forum forum);

    Optional<ForumPost> findByIdAndActiveTrue(Long id);

    Long countByForumAndActiveTrue(Forum forum);
}