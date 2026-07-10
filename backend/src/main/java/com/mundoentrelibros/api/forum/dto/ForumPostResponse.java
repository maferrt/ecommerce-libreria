package com.mundoentrelibros.api.forum.dto;

import java.time.LocalDateTime;

public record ForumPostResponse(
        Long id,
        String forumSlug,
        String title,
        String contentHtml,
        ForumAuthorResponse author,
        Long replyCount,
        Boolean currentUserCanDelete,
        LocalDateTime createdAt
) {
}