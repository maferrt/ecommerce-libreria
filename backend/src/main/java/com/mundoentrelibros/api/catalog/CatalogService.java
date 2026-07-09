package com.mundoentrelibros.api.catalog;

import com.mundoentrelibros.api.catalog.dto.BookResponse;
import com.mundoentrelibros.api.catalog.dto.CatalogResponse;
import com.mundoentrelibros.api.catalog.dto.CategoryResponse;
import com.mundoentrelibros.api.catalog.dto.SagaResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final SagaRepository sagaRepository;

    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAllByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toCategoryResponse)
                .toList();
    }

    public List<BookResponse> getBooks(String category) {
        List<Book> books;

        if (category == null || category.isBlank()) {
            books = bookRepository.findAllByActiveTrueOrderByCatalogIdAsc();
        } else {
            books = bookRepository.findAllByCategorySlugAndActiveTrueOrderByCatalogIdAsc(
                    category.trim()
            );
        }

        return books.stream()
                .map(this::toBookResponse)
                .toList();
    }

    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findByCatalogIdAndActiveTrue(id)
                .orElseThrow(() -> new IllegalArgumentException("Libro no encontrado."));

        return toBookResponse(book);
    }

    public List<SagaResponse> getSagas() {
        return sagaRepository.findAllByActiveTrueOrderByIdAsc()
                .stream()
                .map(this::toSagaResponse)
                .toList();
    }

    public SagaResponse getSagaBySlug(String slug) {
        Saga saga = sagaRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new IllegalArgumentException("Saga no encontrada."));

        return toSagaResponse(saga);
    }

    public CatalogResponse getCatalog() {
        return new CatalogResponse(
                getBooks(null),
                getSagas()
        );
    }

    private CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(
                category.getSlug(),
                category.getName()
        );
    }

    private BookResponse toBookResponse(Book book) {
        return new BookResponse(
                book.getCatalogId(),
                book.getTitle(),
                book.getAuthor(),
                book.getCategory().getSlug(),
                book.getSagaName(),
                book.getPublisher(),
                book.getEdition(),
                book.getIsbn(),
                book.getPrice(),
                book.getCoverImage(),
                book.getSynopsis()
        );
    }

    private SagaResponse toSagaResponse(Saga saga) {
        List<Long> bookIds = saga.getBooks()
                .stream()
                .map(Book::getCatalogId)
                .toList();

        return new SagaResponse(
                saga.getSlug(),
                saga.getName(),
                saga.getSagaIsbn(),
                saga.getSagaPrice(),
                saga.getCoverImage(),
                saga.getDescription(),
                bookIds
        );
    }
}