package com.mundoentrelibros.api.order;

import com.mundoentrelibros.api.user.AppUser;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "purchase_orders",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_purchase_orders_order_number", columnNames = "order_number")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PurchaseOrder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, length = 60)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private OrderStatus status;

    @Column(name = "total_items", nullable = false)
    private Integer totalItems;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "payment_method", length = 80)
    private String paymentMethod;

    @Column(name = "delivery_notes", columnDefinition = "TEXT")
    private String deliveryNotes;

    @Column(name = "shipping_street", length = 180)
    private String shippingStreet;

    @Column(name = "shipping_exterior_number", length = 40)
    private String shippingExteriorNumber;

    @Column(name = "shipping_interior_number", length = 40)
    private String shippingInteriorNumber;

    @Column(name = "shipping_neighborhood", length = 120)
    private String shippingNeighborhood;

    @Column(name = "shipping_city", length = 120)
    private String shippingCity;

    @Column(name = "shipping_state", length = 120)
    private String shippingState;

    @Column(name = "shipping_zip_code", length = 20)
    private String shippingZipCode;

    @Column(name = "shipping_country", length = 80)
    private String shippingCountry;

    @Column(name = "shipping_references", columnDefinition = "TEXT")
    private String shippingReferences;

    @OneToMany(
            mappedBy = "purchaseOrder",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = OrderStatus.CREATED;
        }

        if (total == null) {
            total = BigDecimal.ZERO;
        }

        if (totalItems == null) {
            totalItems = 0;
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
