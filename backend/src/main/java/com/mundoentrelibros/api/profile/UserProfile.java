package com.mundoentrelibros.api.profile;

import com.mundoentrelibros.api.user.AppUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private AppUser user;

    @Column(name = "display_name", nullable = false, length = 120)
    private String displayName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String avatar;

    @Column(name = "current_reading", length = 180)
    private String currentReading;

    @Column(name = "reader_status", nullable = false, length = 80)
    private String readerStatus;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "favorite_genre", nullable = false, length = 80)
    private String favoriteGenre;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (displayName == null || displayName.isBlank()) {
            displayName = user.getName();
        }

        if (readerStatus == null || readerStatus.isBlank()) {
            readerStatus = "Buscando nueva lectura";
        }

        if (favoriteGenre == null || favoriteGenre.isBlank()) {
            favoriteGenre = "Novela Juvenil";
        }

        if (bio == null || bio.isBlank()) {
            bio = "Lector/a de Mundo Entre Libros.";
        }

        if (currentReading == null) {
            currentReading = "";
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}