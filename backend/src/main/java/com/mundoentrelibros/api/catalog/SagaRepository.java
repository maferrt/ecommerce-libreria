package com.mundoentrelibros.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SagaRepository extends JpaRepository<Saga, Long> {

    List<Saga> findAllByActiveTrueOrderByIdAsc();

    Optional<Saga> findBySlugAndActiveTrue(String slug);

    boolean existsBySlug(String slug);
}