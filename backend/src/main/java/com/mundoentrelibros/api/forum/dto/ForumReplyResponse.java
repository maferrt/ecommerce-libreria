package com.mundoentrelibros.api.forum.dto;

import java.time.LocalDateTime;

public record ForumReplyResponse(
        Long id,
        Long postId,
        String contentHtml,
        ForumAuthorResponse author,
        Boolean currentUserCanDelete,
        LocalDateTime createdAt
) {
}