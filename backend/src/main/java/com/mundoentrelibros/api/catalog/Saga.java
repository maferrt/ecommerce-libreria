package com.mundoentrelibros.api.catalog;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "sagas",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_sagas_slug", columnNames = "slug"),
                @UniqueConstraint(name = "uk_sagas_isbn", columnNames = "saga_isbn")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Saga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Este slug será el "id" que espera el frontend.
     * Ejemplo: "hunger-games", "harry-potter", "percy-jackson".
     */
    @Column(nullable = false, length = 100)
    private String slug;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(name = "saga_isbn", nullable = false, length = 40)
    private String sagaIsbn;

    @Column(name = "saga_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal sagaPrice;

    @Column(name = "cover_image", nullable = false, length = 300)
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToMany
    @JoinTable(
            name = "saga_books",
            joinColumns = @JoinColumn(name = "saga_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    @OrderColumn(name = "book_order")
    @Builder.Default
    private List<Book> books = new ArrayList<>();

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}