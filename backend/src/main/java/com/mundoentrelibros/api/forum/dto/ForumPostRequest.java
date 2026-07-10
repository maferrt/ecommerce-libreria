package com.mundoentrelibros.api.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForumPostRequest(
        @NotBlank(message = "El título es obligatorio.")
        @Size(max = 180, message = "El título no puede superar 180 caracteres.")
        String title,

        @NotBlank(message = "El contenido es obligatorio.")
        String contentHtml
) {
}