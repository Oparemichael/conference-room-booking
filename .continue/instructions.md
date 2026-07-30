# Conference Room Booking System

## Project Overview
This is an internal conference room booking application.

## Frontend
Technology:
- React
- Vite
- Tailwind CSS
- FullCalendar

Main frontend areas:
- Room listing
- Room calendar
- Booking form modal
- Admin dashboard
- Room management

Important components:
- RoomCalendar.jsx
- BookingForm.jsx
- AdminCalendar.jsx
- Rooms.jsx
- AdminDashboard.jsx

## Backend
Technology:
- Node.js
- Express
- PostgreSQL

Backend responsibilities:
- Manage rooms
- Create bookings
- Validate availability
- Prevent double booking
- Manage booking status

Important routes:
- /api/rooms
- /api/bookings
- /api/auth

## Database
PostgreSQL database.

Bookings table includes:
- id
- room_id
- full_name
- email
- purpose
- start_time
- end_time
- status
- meeting_title

## Development Rules
When suggesting changes:
- Maintain the existing architecture.
- Avoid rewriting working features unnecessarily.
- Follow React best practices.
- Use Tailwind CSS for styling.
- Preserve existing API routes.
- Consider frontend and backend impact before changes.