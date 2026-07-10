package com.mundoentrelibros.api.forum.dto;

public record ForumResponse(
        Long id,
        String slug,
        String name,
        String description,
        String coverImage,
        Boolean subscribed,
        Integer points,
        Long postCount
) {
}