package com.mundoentrelibros.api.order;

import com.mundoentrelibros.api.address.Address;
import com.mundoentrelibros.api.address.AddressService;
import com.mundoentrelibros.api.cart.Cart;
import com.mundoentrelibros.api.cart.CartItem;
import com.mundoentrelibros.api.cart.CartItemRepository;
import com.mundoentrelibros.api.cart.CartItemType;
import com.mundoentrelibros.api.cart.CartService;
import com.mundoentrelibros.api.catalog.Book;
import com.mundoentrelibros.api.catalog.Saga;
import com.mundoentrelibros.api.order.dto.CheckoutRequest;
import com.mundoentrelibros.api.order.dto.OrderItemResponse;
import com.mundoentrelibros.api.order.dto.OrderResponse;
import com.mundoentrelibros.api.order.dto.ShippingAddressResponse;
import com.mundoentrelibros.api.user.AppUser;
import com.mundoentrelibros.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final AddressService addressService;
    private final CartService cartService;
    private final CartItemRepository cartItemRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    @Transactional
    public OrderResponse checkout(String userEmail, CheckoutRequest request) {
        AppUser user = getUserByEmail(userEmail);
        Cart cart = cartService.getOrCreateCart(user);
        List<CartItem> cartItems = cartItemRepository.findAllByCartOrderByCreatedAtDesc(cart);

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío.");
        }

        Address address = addressService.getOrCreateAddress(user);

        PurchaseOrder order = PurchaseOrder.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .status(OrderStatus.CREATED)
                .paymentMethod(cleanOrDefault(
                        request == null ? null : request.paymentMethod(),
                        "Simulado"
                ))
                .deliveryNotes(clean(request == null ? null : request.deliveryNotes()))
                .shippingStreet(address.getStreet())
                .shippingExteriorNumber(address.getExteriorNumber())
                .shippingInteriorNumber(address.getInteriorNumber())
                .shippingNeighborhood(address.getNeighborhood())
                .shippingCity(address.getCity())
                .shippingState(address.getState())
                .shippingZipCode(address.getZipCode())
                .shippingCountry(address.getCountry())
                .shippingReferences(address.getReferences())
                .build();

        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> toOrderItem(order, cartItem))
                .toList();

        BigDecimal total = orderItems.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer totalItems = orderItems.stream()
                .map(OrderItem::getQuantity)
                .reduce(0, Integer::sum);

        order.setItems(orderItems);
        order.setTotal(total);
        order.setTotalItems(totalItems);

        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

        cartItemRepository.deleteAllByCart(cart);

        return toOrderResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders(String userEmail) {
        AppUser user = getUserByEmail(userEmail);

        return purchaseOrderRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    public OrderResponse getOrderById(String userEmail, Long orderId) {
        AppUser user = getUserByEmail(userEmail);

        PurchaseOrder order = purchaseOrderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado."));

        return toOrderResponse(order);
    }

    private OrderItem toOrderItem(PurchaseOrder order, CartItem cartItem) {
        if (cartItem.getItemType() == CartItemType.BOOK) {
            Book book = cartItem.getBook();

            BigDecimal unitPrice = book.getPrice();
            BigDecimal subtotal = unitPrice.multiply(
                    BigDecimal.valueOf(cartItem.getQuantity())
            );

            return OrderItem.builder()
                    .purchaseOrder(order)
                    .itemType(OrderItemType.BOOK)
                    .book(book)
                    .saga(null)
                    .bookCatalogId(book.getCatalogId())
                    .sagaSlug(null)
                    .title(book.getTitle())
                    .author(book.getAuthor())
                    .unitPrice(unitPrice)
                    .quantity(cartItem.getQuantity())
                    .subtotal(subtotal)
                    .coverImage(book.getCoverImage())
                    .build();
        }

        Saga saga = cartItem.getSaga();

        BigDecimal unitPrice = saga.getSagaPrice();
        BigDecimal subtotal = unitPrice.multiply(
                BigDecimal.valueOf(cartItem.getQuantity())
        );

        return OrderItem.builder()
                .purchaseOrder(order)
                .itemType(OrderItemType.SAGA)
                .book(null)
                .saga(saga)
                .bookCatalogId(null)
                .sagaSlug(saga.getSlug())
                .title(saga.getName())
                .author("Saga")
                .unitPrice(unitPrice)
                .quantity(cartItem.getQuantity())
                .subtotal(subtotal)
                .coverImage(saga.getCoverImage())
                .build();
    }

    private OrderResponse toOrderResponse(PurchaseOrder order) {
        List<OrderItemResponse> itemResponses = order.getItems()
                .stream()
                .map(this::toOrderItemResponse)
                .toList();

        ShippingAddressResponse shippingAddress = new ShippingAddressResponse(
                order.getShippingStreet(),
                order.getShippingExteriorNumber(),
                order.getShippingInteriorNumber(),
                order.getShippingNeighborhood(),
                order.getShippingCity(),
                order.getShippingState(),
                order.getShippingZipCode(),
                order.getShippingCountry(),
                order.getShippingReferences()
        );

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getStatus(),
                order.getTotalItems(),
                order.getTotal(),
                order.getPaymentMethod(),
                order.getDeliveryNotes(),
                shippingAddress,
                itemResponses,
                order.getCreatedAt()
        );
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getItemType().name(),
                item.getBookCatalogId(),
                item.getSagaSlug(),
                item.getTitle(),
                item.getAuthor(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getSubtotal(),
                item.getCoverImage()
        );
    }

    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String random = UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();

        String orderNumber = "MEL-" + date + "-" + random;

        if (purchaseOrderRepository.existsByOrderNumber(orderNumber)) {
            return generateOrderNumber();
        }

        return orderNumber;
    }

    private AppUser getUserByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String clean(String value) {
        if (value == null) {
            return "";
        }

        return value.trim();
    }

    private String cleanOrDefault(String value, String defaultValue) {
        String cleanedValue = clean(value);

        if (cleanedValue.isBlank()) {
            return defaultValue;
        }

        return cleanedValue;
    }
}