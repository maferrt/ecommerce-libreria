package com.mundoentrelibros.api.catalog;

import com.mundoentrelibros.api.catalog.dto.BookResponse;
import com.mundoentrelibros.api.catalog.dto.CatalogResponse;
import com.mundoentrelibros.api.catalog.dto.CategoryResponse;
import com.mundoentrelibros.api.catalog.dto.SagaResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        return ResponseEntity.ok(catalogService.getCategories());
    }

    @GetMapping("/books")
    public ResponseEntity<List<BookResponse>> getBooks(
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(catalogService.getBooks(category));
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<BookResponse> getBookById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(catalogService.getBookById(id));
    }

    @GetMapping("/sagas")
    public ResponseEntity<List<SagaResponse>> getSagas() {
        return ResponseEntity.ok(catalogService.getSagas());
    }

    @GetMapping("/sagas/{slug}")
    public ResponseEntity<SagaResponse> getSagaBySlug(
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(catalogService.getSagaBySlug(slug));
    }

    @GetMapping("/catalog")
    public ResponseEntity<CatalogResponse> getCatalog() {
        return ResponseEntity.ok(catalogService.getCatalog());
    }
}