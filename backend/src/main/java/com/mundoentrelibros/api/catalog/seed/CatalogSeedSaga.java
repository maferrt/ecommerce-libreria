package com.mundoentrelibros.api.catalog.seed;

import java.math.BigDecimal;
import java.util.List;

public record CatalogSeedSaga(
        String id,
        String nombre,
        String isbnSaga,
        BigDecimal precioSaga,
        String portada,
        String descripcion,
        List<Long> libros
) {
}