package com.eventpro.ems.repository;

import com.eventpro.ems.model.Booking;
import com.eventpro.ems.model.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByUserId(Long userId, Pageable pageable);
    List<Booking> findByEventIdAndStatus(Long eventId, BookingStatus status);

    @Query("select b from Booking b where b.event.organizer.id = :organizerId")
    Page<Booking> findForOrganizer(@Param("organizerId") Long organizerId, Pageable pageable);

    @Query("select coalesce(sum(b.totalPrice), 0) from Booking b where b.event.organizer.id = :organizerId and b.status = 'CONFIRMED'")
    BigDecimal revenueForOrganizer(@Param("organizerId") Long organizerId);

    @Query("select count(b) from Booking b where b.event.organizer.id = :organizerId and b.status = 'CONFIRMED'")
    long confirmedBookingsForOrganizer(@Param("organizerId") Long organizerId);

    @Modifying
    @Query("delete from Booking b where b.event.id = :eventId")
    void deleteByEventId(@Param("eventId") Long eventId);
}
