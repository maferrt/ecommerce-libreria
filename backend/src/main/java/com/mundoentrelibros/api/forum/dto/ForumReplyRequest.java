package com.mundoentrelibros.api.forum.dto;

import jakarta.validation.constraints.NotBlank;

public record ForumReplyRequest(
        @NotBlank(message = "La respuesta no puede estar vacía.")
        String contentHtml
) {
}