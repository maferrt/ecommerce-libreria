package com.mundoentrelibros.api.address;

import com.mundoentrelibros.api.user.AppUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = false)
    private AppUser user;

    @Column(length = 180)
    private String street;

    @Column(name = "exterior_number", length = 40)
    private String exteriorNumber;

    @Column(name = "interior_number", length = 40)
    private String interiorNumber;

    @Column(length = 120)
    private String neighborhood;

    @Column(length = 120)
    private String city;

    @Column(name = "state_name", length = 120)
    private String state;

    @Column(name = "zip_code", length = 20)
    private String zipCode;

    @Column(length = 80)
    private String country;

    @Column(name = "address_references", columnDefinition = "TEXT")
    private String references;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (country == null || country.isBlank()) {
            country = "México";
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}