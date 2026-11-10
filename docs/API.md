# Advanced Event Management API

Base URL: `http://localhost:8080`

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Auth

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register `USER` accounts only |
| POST | `/api/auth/login` | Public | Login and receive JWT |

Default seeded admin: `admin@eventpro.local` / `Admin@12345`
Default seeded organizer: `organizer@eventpro.local` / `Organizer@123`
Default seeded user: `user@eventpro.local` / `User@12345`

## Events

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/events` | Public | Approved events with pagination, sorting, search, filters |
| GET | `/api/events/{id}` | Public | Event details |
| POST | `/api/events` | ORGANIZER, ADMIN | Create and publish an event |
| PUT | `/api/events/{id}` | Owner organizer, ADMIN | Update event |
| DELETE | `/api/events/{id}` | Owner organizer, ADMIN | Delete event |
| GET | `/api/events/organizer/mine` | ORGANIZER, ADMIN | Organizer event list |
| POST | `/api/events/upload` | ORGANIZER, ADMIN | Multipart upload, returns image URL |
| PATCH | `/api/events/{id}/moderate?status=APPROVED` | ADMIN | Approve or reject event |

Event query parameters include `category`, `location`, `search`, `fromDate`, `toDate`, `freeOnly`, `maxPrice`, `page`, `size`, and `sort`.

Supported categories: `MUSIC`, `TECH`, `SPORTS`, `EDUCATION`, `BUSINESS`, `WORKSHOP`, `FESTIVAL`, `FOOD`, `ART`, `NETWORKING`.

## Bookings and Payments

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/bookings` | USER, ADMIN | Reserve seats and create pending booking |
| GET | `/api/bookings/mine` | Authenticated | Current user's bookings |
| PATCH | `/api/bookings/{id}/cancel` | Owner, organizer, ADMIN | Cancel with 24-hour rule |
| POST | `/api/payments/simulate` | Owner | Confirm booking or simulate failure |
| GET | `/api/bookings/organizer` | ORGANIZER, ADMIN | Attendee bookings for organizer events |
| GET | `/api/bookings/organizer/dashboard` | ORGANIZER, ADMIN | Revenue and confirmed booking summary |

## Admin

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/admin/users` | ADMIN | Paginated users, optional role filter |
| POST | `/api/admin/organizers` | ADMIN | Create an organizer account |
| PATCH | `/api/admin/users/{id}/status?status=BLOCKED` | ADMIN | Block or unblock users |

Use `Authorization: Bearer <token>` on protected endpoints.
