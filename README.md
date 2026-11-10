# Advanced Event Management System

Full-stack production-style event management application with Spring Boot, JWT security, MySQL, React, Tailwind, Axios, dashboards, booking/payment simulation, image upload, pagination, search, validation, and API docs.

## Run

1. Start MySQL:
   ```bash
   docker compose up -d mysql
   ```
2. Start backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
3. Start frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Backend defaults to `http://localhost:8080`; frontend defaults to `http://localhost:5173`.

Seeded accounts:
- Admin: `admin@eventpro.local` / `Admin@12345`
- Organizer: `organizer@eventpro.local` / `Organizer@123`
- User: `user@eventpro.local` / `User@12345`

Public registration creates user accounts only. Admins create organizer accounts from the admin dashboard.

API details live in `docs/API.md`; generated Swagger UI is available at `/swagger-ui.html`.
