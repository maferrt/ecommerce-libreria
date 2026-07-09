package com.mundoentrelibros.api.order;

import com.mundoentrelibros.api.catalog.Book;
import com.mundoentrelibros.api.catalog.Saga;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false, length = 30)
    private OrderItemType itemType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saga_id")
    private Saga saga;

    @Column(name = "book_catalog_id")
    private Long bookCatalogId;

    @Column(name = "saga_slug", length = 120)
    private String sagaSlug;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(length = 160)
    private String author;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "cover_image", length = 300)
    private String coverImage;
}