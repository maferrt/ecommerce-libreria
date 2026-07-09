package com.mundoentrelibros.api.order;

import com.mundoentrelibros.api.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    List<PurchaseOrder> findAllByUserOrderByCreatedAtDesc(AppUser user);

    Optional<PurchaseOrder> findByIdAndUser(Long id, AppUser user);

    boolean existsByOrderNumber(String orderNumber);
}