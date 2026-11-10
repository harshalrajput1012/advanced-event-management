package com.eventpro.ems.repository;

import com.eventpro.ems.model.Event;
import com.eventpro.ems.model.EventCategory;
import com.eventpro.ems.model.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from Event e where e.id = :id")
    Optional<Event> findLockedById(@Param("id") Long id);

    @Query("""
            select e from Event e
            where (:status is null or e.status = :status)
              and (:organizerId is null or e.organizer.id = :organizerId)
              and (:category is null or e.category = :category)
              and (:location is null or lower(e.location) like lower(concat('%', :location, '%')))
              and (:search is null or lower(e.title) like lower(concat('%', :search, '%')) or lower(e.description) like lower(concat('%', :search, '%')))
              and (:fromDate is null or e.dateTime >= :fromDate)
              and (:toDate is null or e.dateTime <= :toDate)
              and (:freeOnly is null or (:freeOnly = true and e.price = 0) or (:freeOnly = false and e.price > 0))
              and (:maxPrice is null or e.price <= :maxPrice)
            """)
    Page<Event> search(@Param("status") EventStatus status,
                       @Param("organizerId") Long organizerId,
                       @Param("category") EventCategory category,
                       @Param("location") String location,
                       @Param("search") String search,
                       @Param("fromDate") LocalDateTime fromDate,
                       @Param("toDate") LocalDateTime toDate,
                       @Param("freeOnly") Boolean freeOnly,
                       @Param("maxPrice") BigDecimal maxPrice,
                       Pageable pageable);
}
