package com.mundoentrelibros.api.forum;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ForumReplyRepository extends JpaRepository<ForumReply, Long> {

    List<ForumReply> findAllByPostAndActiveTrueOrderByCreatedAtAsc(ForumPost post);

    Optional<ForumReply> findByIdAndActiveTrue(Long id);

    Long countByPostAndActiveTrue(ForumPost post);
}