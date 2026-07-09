package com.mundoentrelibros.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findAllByActiveTrueOrderByCatalogIdAsc();

    List<Book> findAllByCategorySlugAndActiveTrueOrderByCatalogIdAsc(String categorySlug);

    Optional<Book> findByCatalogIdAndActiveTrue(Long catalogId);

    boolean existsByCatalogId(Long catalogId);

    boolean existsByIsbn(String isbn);
}