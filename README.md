# Full Stack Application

This is a full-stack application built with:
- Frontend: Angular
- Backend: Spring Boot (Java)
- Database: PostgreSQL

## Project Structure
```
.
├── frontend/          # Angular application
└── backend/           # Spring Boot application
```

## Prerequisites
- Node.js and npm
- Java JDK 17 or later
- Maven
- PostgreSQL
- Angular CLI

## Setup Instructions

### Database Setup
1. Install PostgreSQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE fullstackdb;
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```
2. Build the project:
```bash
./mvnw clean install
```
3. Run the application:
```bash
./mvnw spring-boot:run
```
The backend will start on http://localhost:8080

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Run the application:
```bash
ng serve
```
The frontend will start on http://localhost:4200

## Development

### Frontend Development
The Angular frontend is configured to proxy API requests to the backend. The proxy configuration is in `frontend/proxy.conf.json`.

### Backend Development
The Spring Boot backend uses:
- Spring Data JPA for database operations
- Spring Web for REST endpoints
- Spring Security for authentication (if implemented)

### API Documentation
Once the backend is running, you can access the Swagger UI documentation at:
http://localhost:8080/swagger-ui.html 