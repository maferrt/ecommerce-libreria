package com.mundoentrelibros.api.catalog.dto;

import java.math.BigDecimal;
import java.util.List;

public record SagaResponse(
        String id,
        String nombre,
        String isbnSaga,
        BigDecimal precioSaga,
        String portada,
        String descripcion,
        List<Long> libros
) {
}