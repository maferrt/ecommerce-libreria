package com.mundoentrelibros.api.catalog.seed;

import java.math.BigDecimal;

public record CatalogSeedBook(
        Long id,
        String titulo,
        String autor,
        String categoria,
        String saga,
        String editorial,
        String edicion,
        String isbn,
        BigDecimal precio,
        String portada,
        String sinopsis
) {
}