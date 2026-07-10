package com.mundoentrelibros.api.forum.dto;

import java.util.List;

public record ForumPostDetailResponse(
        ForumPostResponse post,
        List<ForumReplyResponse> replies
) {
}