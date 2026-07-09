package com.mundoentrelibros.api.catalog.dto;

import java.util.List;

public record CatalogResponse(
        List<BookResponse> libros,
        List<SagaResponse> sagas
) {
}