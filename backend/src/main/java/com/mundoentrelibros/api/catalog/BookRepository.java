package com.mundoentrelibros.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findAllByActiveTrueOrderByIdAsc();

    List<Book> findAllByCategorySlugAndActiveTrueOrderByIdAsc(String categorySlug);

    Optional<Book> findByIdAndActiveTrue(Long id);

    boolean existsByIsbn(String isbn);
}