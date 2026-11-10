package com.eventpro.ems.dto;

import java.math.BigDecimal;

public record OrganizerDashboardResponse(long confirmedBookings, BigDecimal totalRevenue) {
}
