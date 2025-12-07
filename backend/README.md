# Transport Management System (TMS) - Backend

A robust Spring Boot backend for managing logistics operations including loads, transporters, bids, and bookings.

## Tech Stack

- **Framework**: Spring Boot 3.2+
- **Language**: Java 17+
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **API Documentation**: Swagger/OpenAPI 3.0

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- PostgreSQL 14+

## Database Setup

1. Install PostgreSQL and create a database:

\`\`\`sql
CREATE DATABASE tms_db;
\`\`\`

2. Update `src/main/resources/application.yml` with your PostgreSQL credentials:

\`\`\`yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tms_db
    username: your_username
    password: your_password
\`\`\`

## Running the Application

### Using Maven

\`\`\`bash
cd backend
mvn clean install
mvn spring-boot:run
\`\`\`

### Using JAR

\`\`\`bash
cd backend
mvn clean package
java -jar target/tms-backend-1.0.0.jar
\`\`\`

The application will start on `http://localhost:8080`

## API Documentation

Once running, access Swagger UI at: `http://localhost:8080/swagger-ui.html`

## API Endpoints (15 Total)

### Load APIs (5)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/load` | Create a new load |
| GET | `/load` | List loads with pagination & filters |
| GET | `/load/{loadId}` | Get load details with active bids |
| PATCH | `/load/{loadId}/cancel` | Cancel a load |
| GET | `/load/{loadId}/best-bids` | Get sorted bid suggestions |

### Transporter APIs (3)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/transporter` | Register transporter |
| GET | `/transporter/{transporterId}` | Get transporter details |
| PUT | `/transporter/{transporterId}/trucks` | Update truck capacity |

### Bid APIs (4)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bid` | Submit a bid |
| GET | `/bid` | Filter bids |
| GET | `/bid/{bidId}` | Get bid details |
| PATCH | `/bid/{bidId}/reject` | Reject a bid |

### Booking APIs (3)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/booking` | Accept bid & create booking |
| GET | `/booking/{bookingId}` | Get booking details |
| PATCH | `/booking/{bookingId}/cancel` | Cancel booking |

## Database Schema

\`\`\`
┌─────────────────┐     ┌─────────────────┐
│     loads       │     │  transporters   │
├─────────────────┤     ├─────────────────┤
│ load_id (PK)    │     │ transporter_id  │
│ shipper_id      │     │ company_name    │
│ loading_city    │     │ rating          │
│ unloading_city  │     └────────┬────────┘
│ loading_date    │              │
│ product_type    │     ┌────────┴────────┐
│ weight          │     │ truck_capacities│
│ weight_unit     │     ├─────────────────┤
│ truck_type      │     │ id (PK)         │
│ no_of_trucks    │     │ transporter_id  │
│ remaining_trucks│     │ truck_type      │
│ status          │     │ count           │
│ date_posted     │     └─────────────────┘
│ version         │
└────────┬────────┘
         │
    ┌────┴────┐
    │  bids   │
    ├─────────┤
    │ bid_id  │───────────────┐
    │ load_id │               │
    │ transporter_id          │
    │ proposed_rate           │
    │ trucks_offered          │
    │ status  │               │
    │ submitted_at            │
    └────┬────┘               │
         │                    │
    ┌────┴────┐               │
    │bookings │               │
    ├─────────┤               │
    │booking_id               │
    │ load_id │               │
    │ bid_id (UNIQUE)─────────┘
    │ transporter_id
    │ allocated_trucks
    │ final_rate
    │ status  │
    │ booked_at
    └─────────┘
\`\`\`

## Business Rules Implemented

### Rule 1: Capacity Validation
- Transporter can only bid if `trucksOffered ≤ availableTrucks` for that truck type
- When booking confirmed, trucks are deducted from transporter's capacity
- When booking cancelled, trucks are restored

### Rule 2: Load Status Transitions
- `POSTED → OPEN_FOR_BIDS` (when first bid received)
- `OPEN_FOR_BIDS → BOOKED` (when all trucks allocated)
- Cannot bid on `CANCELLED` or `BOOKED` loads
- Cannot cancel `BOOKED` loads

### Rule 3: Multi-Truck Allocation
- Multiple bookings allowed until `remainingTrucks == 0`
- Load becomes `BOOKED` only when fully allocated

### Rule 4: Concurrent Booking Prevention
- Uses `@Version` for optimistic locking
- HTTP 409 returned on concurrent modification conflicts

### Rule 5: Best Bid Calculation
- Score formula: `(1/proposedRate) * 0.7 + (rating/5) * 0.3`
- Higher score = better bid

## Exception Handling

| Exception | HTTP Status | Description |
|-----------|-------------|-------------|
| `ResourceNotFoundException` | 404 | Entity not found |
| `InvalidStatusTransitionException` | 400 | Invalid state change |
| `InsufficientCapacityException` | 400 | Not enough trucks |
| `LoadAlreadyBookedException` | 409 | Concurrent booking conflict |

## Testing

\`\`\`bash
mvn test
\`\`\`

## Project Structure

\`\`\`
backend/
├── src/main/java/com/tms/
│   ├── TmsApplication.java
│   ├── config/
│   │   └── OpenApiConfig.java
│   ├── controller/
│   │   ├── LoadController.java
│   │   ├── TransporterController.java
│   │   ├── BidController.java
│   │   └── BookingController.java
│   ├── service/
│   │   ├── LoadService.java
│   │   ├── TransporterService.java
│   │   ├── BidService.java
│   │   └── BookingService.java
│   ├── repository/
│   │   ├── LoadRepository.java
│   │   ├── TransporterRepository.java
│   │   ├── BidRepository.java
│   │   └── BookingRepository.java
│   ├── entity/
│   │   ├── Load.java
│   │   ├── Transporter.java
│   │   ├── TruckCapacity.java
│   │   ├── Bid.java
│   │   └── Booking.java
│   ├── dto/
│   │   ├── LoadDTO.java
│   │   ├── TransporterDTO.java
│   │   ├── BidDTO.java
│   │   └── BookingDTO.java
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       ├── ResourceNotFoundException.java
│       ├── InvalidStatusTransitionException.java
│       ├── InsufficientCapacityException.java
│       └── LoadAlreadyBookedException.java
├── src/main/resources/
│   └── application.yml
├── pom.xml
└── README.md
