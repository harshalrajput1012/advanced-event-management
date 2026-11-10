package com.eventpro.ems.repository;

import com.eventpro.ems.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Modifying
    @Query("delete from Payment p where p.booking.event.id = :eventId")
    void deleteByEventId(@Param("eventId") Long eventId);
}
