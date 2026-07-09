package com.mundoentrelibros.api.catalog;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mundoentrelibros.api.catalog.seed.CatalogSeedBook;
import com.mundoentrelibros.api.catalog.seed.CatalogSeedData;
import com.mundoentrelibros.api.catalog.seed.CatalogSeedSaga;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CatalogDataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final SagaRepository sagaRepository;
    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;

    private static final Map<String, String> CATEGORY_LABELS = new LinkedHashMap<>();

    static {
        CATEGORY_LABELS.put("novela-juvenil", "Novela Juvenil");
        CATEGORY_LABELS.put("fantasia", "Fantasía");
        CATEGORY_LABELS.put("terror", "Terror");
        CATEGORY_LABELS.put("desarrollo-personal", "Desarrollo personal");
        CATEGORY_LABELS.put("ciencia-ficcion", "Ciencia Ficción");
        CATEGORY_LABELS.put("educacion-financiera", "Educación financiera");
        CATEGORY_LABELS.put("psicologia", "Psicología");
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (bookRepository.count() > 0 || sagaRepository.count() > 0) {
            return;
        }

        seedCategories();

        CatalogSeedData catalogData = loadCatalogData();

        Map<Long, Book> savedBooksByCatalogId = seedBooks(catalogData.libros());

        seedSagas(catalogData.sagas(), savedBooksByCatalogId);
    }

    private CatalogSeedData loadCatalogData() {
        try {
            Resource resource = resourceLoader.getResource("classpath:data/catalog.json");

            try (InputStream inputStream = resource.getInputStream()) {
                return objectMapper.readValue(inputStream, CatalogSeedData.class);
            }
        } catch (Exception exception) {
            throw new IllegalStateException("No se pudo leer data/catalog.json", exception);
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) {
            return;
        }

        int order = 1;

        for (Map.Entry<String, String> category : CATEGORY_LABELS.entrySet()) {
            Category newCategory = Category.builder()
                    .slug(category.getKey())
                    .name(category.getValue())
                    .displayOrder(order)
                    .active(true)
                    .build();

            categoryRepository.save(newCategory);

            order++;
        }
    }

    private Map<Long, Book> seedBooks(List<CatalogSeedBook> seedBooks) {
        Map<Long, Book> savedBooksByCatalogId = new LinkedHashMap<>();

        for (CatalogSeedBook seedBook : seedBooks) {
            Category category = categoryRepository.findBySlug(seedBook.categoria())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Categoría no encontrada: " + seedBook.categoria()
                    ));

            Book newBook = Book.builder()
                    .catalogId(seedBook.id())
                    .title(seedBook.titulo())
                    .author(seedBook.autor())
                    .category(category)
                    .sagaName(seedBook.saga())
                    .publisher(seedBook.editorial())
                    .edition(seedBook.edicion())
                    .isbn(seedBook.isbn())
                    .price(seedBook.precio())
                    .coverImage(seedBook.portada())
                    .synopsis(seedBook.sinopsis())
                    .active(true)
                    .build();

            Book savedBook = bookRepository.save(newBook);

            savedBooksByCatalogId.put(seedBook.id(), savedBook);
        }

        return savedBooksByCatalogId;
    }

    private void seedSagas(
            List<CatalogSeedSaga> seedSagas,
            Map<Long, Book> savedBooksByCatalogId
    ) {
        for (CatalogSeedSaga seedSaga : seedSagas) {
            List<Book> sagaBooks = seedSaga.libros()
                    .stream()
                    .map(bookId -> {
                        Book book = savedBooksByCatalogId.get(bookId);

                        if (book == null) {
                            throw new IllegalArgumentException(
                                    "Libro no encontrado para la saga "
                                            + seedSaga.nombre()
                                            + ". ID libro: "
                                            + bookId
                            );
                        }

                        return book;
                    })
                    .toList();

            Saga newSaga = Saga.builder()
                    .slug(seedSaga.id())
                    .name(seedSaga.nombre())
                    .sagaIsbn(seedSaga.isbnSaga())
                    .sagaPrice(seedSaga.precioSaga())
                    .coverImage(seedSaga.portada())
                    .description(seedSaga.descripcion())
                    .books(sagaBooks)
                    .active(true)
                    .build();

            sagaRepository.save(newSaga);
        }
    }
}