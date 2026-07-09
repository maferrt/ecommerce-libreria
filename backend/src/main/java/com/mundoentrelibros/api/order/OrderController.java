package com.mundoentrelibros.api.order;

import com.mundoentrelibros.api.order.dto.CheckoutRequest;
import com.mundoentrelibros.api.order.dto.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> checkout(
            Authentication authentication,
            @RequestBody(required = false) CheckoutRequest request
    ) {
        OrderResponse response = orderService.checkout(
                authentication.getName(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            Authentication authentication
    ) {
        List<OrderResponse> response = orderService.getMyOrders(
                authentication.getName()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            Authentication authentication,
            @PathVariable Long orderId
    ) {
        OrderResponse response = orderService.getOrderById(
                authentication.getName(),
                orderId
        );

        return ResponseEntity.ok(response);
    }
}