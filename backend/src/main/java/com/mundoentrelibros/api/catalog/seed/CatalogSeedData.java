package com.mundoentrelibros.api.catalog.seed;

import java.util.List;

public record CatalogSeedData(
        List<CatalogSeedBook> libros,
        List<CatalogSeedSaga> sagas
) {
}