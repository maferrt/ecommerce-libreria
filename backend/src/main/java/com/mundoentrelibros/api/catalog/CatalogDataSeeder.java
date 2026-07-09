package com.mundoentrelibros.api.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CatalogDataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final SagaRepository sagaRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            seedCategories();
        }

        if (bookRepository.count() == 0) {
            seedBooksAndSagas();
        }
    }

    private void seedCategories() {
        categoryRepository.saveAll(List.of(
                createCategory("novela-juvenil", "Novela Juvenil", 1),
                createCategory("fantasia", "Fantasía", 2),
                createCategory("terror", "Terror", 3),
                createCategory("desarrollo-personal", "Desarrollo personal", 4),
                createCategory("ciencia-ficcion", "Ciencia Ficción", 5),
                createCategory("educacion-financiera", "Educación financiera", 6),
                createCategory("psicologia", "Psicología", 7)
        ));
    }

    private void seedBooksAndSagas() {
        Category novelaJuvenil = getCategory("novela-juvenil");

        Book book1 = Book.builder()
                .title("Los Juegos del Hambre")
                .author("Suzanne Collins")
                .category(novelaJuvenil)
                .sagaName("Los Juegos del Hambre")
                .publisher("Editorial Molino")
                .edition("Edición Especial Cantos Pintados")
                .isbn("9786073854672")
                .price(BigDecimal.valueOf(499))
                .coverImage("/images/books/novela-juvenil/Juegos_del_hambre.jpg")
                .synopsis("Katniss Everdeen se ofrece como voluntaria para participar en un mortal espectáculo televisado donde solo puede haber un ganador.")
                .active(true)
                .build();

        Book book2 = Book.builder()
                .title("En llamas")
                .author("Suzanne Collins")
                .category(novelaJuvenil)
                .sagaName("Los Juegos del Hambre")
                .publisher("Editorial Molino")
                .edition("Edición Especial Cantos Pintados")
                .isbn("9786073854689")
                .price(BigDecimal.valueOf(499))
                .coverImage("/images/books/novela-juvenil/En_llamas.jpg")
                .synopsis("Katniss y Peeta vuelven al centro de una rebelión que amenaza al Capitolio.")
                .active(true)
                .build();

        Book book3 = Book.builder()
                .title("Sinsajo")
                .author("Suzanne Collins")
                .category(novelaJuvenil)
                .sagaName("Los Juegos del Hambre")
                .publisher("Editorial Molino")
                .edition("Edición Especial Cantos Pintados")
                .isbn("9786073854696")
                .price(BigDecimal.valueOf(499))
                .coverImage("/images/books/novela-juvenil/Sinsajo.jpg")
                .synopsis("Katniss se convierte en el símbolo de la rebelión contra el Capitolio.")
                .active(true)
                .build();

        List<Book> savedBooks = bookRepository.saveAll(List.of(book1, book2, book3));

        Saga saga = Saga.builder()
                .slug("los-juegos-del-hambre")
                .name("Los Juegos del Hambre")
                .sagaIsbn("9786073854702")
                .sagaPrice(BigDecimal.valueOf(1299))
                .coverImage("/images/books/sagas/Saga_juegos_del_hambre.jpg")
                .description("Una saga distópica sobre supervivencia, rebelión y resistencia.")
                .books(savedBooks)
                .active(true)
                .build();

        sagaRepository.save(saga);
    }

    private Category createCategory(String slug, String name, int displayOrder) {
        return Category.builder()
                .slug(slug)
                .name(name)
                .displayOrder(displayOrder)
                .active(true)
                .build();
    }

    private Category getCategory(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + slug));
    }
}