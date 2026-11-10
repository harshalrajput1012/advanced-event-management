package com.eventpro.ems.controller;

import com.eventpro.ems.dto.event.EventRequest;
import com.eventpro.ems.dto.event.EventResponse;
import com.eventpro.ems.model.EventCategory;
import com.eventpro.ems.model.EventStatus;
import com.eventpro.ems.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @GetMapping
    public Page<EventResponse> search(@RequestParam(required = false) EventStatus status,
                                      @RequestParam(required = false) EventCategory category,
                                      @RequestParam(required = false) String location,
                                      @RequestParam(required = false) String search,
                                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
                                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
                                      @RequestParam(required = false) Boolean freeOnly,
                                      @RequestParam(required = false) BigDecimal maxPrice,
                                      Pageable pageable) {
        return eventService.search(status, category, location, search, fromDate, toDate, freeOnly, maxPrice, pageable);
    }

    @GetMapping("/{id}")
    public EventResponse get(@PathVariable Long id) {
        return eventService.get(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public EventResponse create(@Valid @RequestBody EventRequest request) {
        return eventService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public EventResponse update(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
        return eventService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        eventService.delete(id);
    }

    @GetMapping("/organizer/mine")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public Page<EventResponse> organizerEvents(Pageable pageable) {
        return eventService.organizerEvents(pageable);
    }

    @PatchMapping("/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public EventResponse moderate(@PathVariable Long id, @RequestParam EventStatus status) {
        return eventService.moderate(id, status);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public Map<String, String> upload(@RequestPart MultipartFile file) {
        return Map.of("url", eventService.saveImage(file, uploadDir));
    }
}
