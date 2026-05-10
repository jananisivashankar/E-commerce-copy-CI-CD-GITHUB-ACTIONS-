package com.Revature.Ecommerce.Platform.repository;

import com.Revature.Ecommerce.Platform.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(String orderId);
}