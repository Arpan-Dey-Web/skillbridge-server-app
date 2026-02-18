# 🎓 LearnHub

## A Production-Ready Tutoring Marketplace Platform

LearnHub is a scalable, role-based tutoring marketplace built with a modern serverless architecture. The platform connects students with tutors, enables structured booking workflows, and provides secure administrative control.

This project demonstrates full-stack engineering practices including authentication architecture, relational database modeling, serverless deployment, and scalable UI design.

---

# 🚀 Live Demo

🔗 https://skillbridge-client-app.vercel.app/

---

# 🔐 Demo Credentials

## 🛡️ Admin

```
Email: admin@gmail.com
Password: 12345678
```

## 👨‍🏫 Tutor

```
Email: jk@gmail.com
Password: 12345678
```

## 👨‍🎓 Student

```
Email: student@gmail.com
Password: 12345678
```

> These accounts are seeded for evaluation purposes.

---

# 🏗 Tech Stack

## Frontend

- Next.js 16 (Latest Version)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Better Auth (Client)

## Backend

- Node.js
- Express.js
- Vercel Serverless API Routes
- Prisma ORM
- PostgreSQL (NeonDB)
- Better Auth (Server)

---

# 🔐 Authentication & Authorization

- Secure session-based authentication using Better Auth
- HTTP-only cookie sessions
- Role-based access control (RBAC)
- Middleware-protected routes
- Admin route isolation

### Roles

- STUDENT
- TUTOR
- ADMIN

---

# ✨ Key Features

## 👨‍🎓 Student Features

- Smart search & filtering
- Instant booking system
- Review submission after completed sessions
- Dashboard with booking history
- Profile management

## 👨‍🏫 Tutor Features

- Profile customization
- Hourly rate management
- Availability slot creation
- Session tracking
- Ratings overview

## 🛡️ Admin Features

- View all users
- Ban / Unban accounts
- Manage categories
- View all bookings

---

# 🗄 Database Schema Overview

LearnHub uses **PostgreSQL (NeonDB)** with **Prisma ORM** to maintain strict relational integrity, role-based access, and authentication session management.

🔗 Full ER Diagram (DrawSQL):  
https://drawsql.app/teams/arpan-dey-workspace/diagrams/learnhub-app-database-schema-design

---

# 🔐 Authentication & Session Models (Better Auth)

## User
Primary entity representing all platform users.

- `id` – String (Primary Key)
- `email` – Unique email
- `name` – Optional full name
- `phone` – Optional phone
- `image` – Profile image URL
- `emailVerified` – Boolean
- `role` – Enum (STUDENT | TUTOR | ADMIN)
- `status` – Enum (ACTIVE | BANNED)
- `createdAt`
- `updatedAt`

### Relations
- One-to-One → TutorProfile
- One-to-Many → Booking (as student)
- One-to-Many → Review
- One-to-Many → Session
- One-to-Many → Account

---

## Session
Stores authenticated session data.

- `id`
- `token` (Unique)
- `expiresAt`
- `ipAddress`
- `userAgent`
- `userId` → FK → User

---

## Account
Handles provider-based authentication (Better Auth support).

- `id`
- `providerId`
- `accountId`
- `accessToken`
- `refreshToken`
- `password` (if credentials-based)
- `userId` → FK → User

---

## Verification
Stores email verification / token-based flows.

- `id`
- `identifier`
- `value`
- `expiresAt`

---

# 🎓 Core Domain Models

## Category
Defines tutoring subject categories.

- `id` (UUID)
- `name` (Unique)

### Relations
- One-to-Many → TutorProfile

---

## TutorProfile
Extends User with tutor-specific data.

- `id` (UUID)
- `bio` (Text)
- `hourlyRate`
- `averageRating`
- `userId` (Unique FK → User)
- `categoryId` (FK → Category)

### Relations
- One-to-One → User
- One-to-Many → Availability
- One-to-Many → Booking

---

## Availability
Stores recurring weekly time slots.

- `id` (UUID)
- `dayOfWeek` (0–6)
- `startTime` (String)
- `endTime` (String)
- `tutorProfileId` → FK → TutorProfile

---

## Booking
Represents a tutoring session between student and tutor.

- `id` (UUID)
- `startTime`
- `endTime`
- `duration`
- `totalPrice`
- `status` (PENDING | CONFIRMED | COMPLETED | CANCELLED)
- `meetLink`
- `studentId` → FK → User
- `tutorProfileId` → FK → TutorProfile
- `createdAt`

### Relations
- Many-to-One → User (Student)
- Many-to-One → TutorProfile
- One-to-One → Review

---

## Review
Stores verified student feedback.

- `id` (UUID)
- `rating` (Integer)
- `comment` (Text)
- `bookingId` (Unique FK → Booking)
- `studentId` → FK → User
- `createdAt`

### Design Constraint
- A review is linked to a specific booking.
- One booking can only have one review.
- Only verified students can leave feedback.

---

# 📊 Booking Status Flow

```
PENDING → CONFIRMED → COMPLETED
       ↘
        CANCELLED
```

---

# 🔎 Schema Design Highlights

- ✅ Strict relational integrity via foreign keys
- ✅ Unique constraint on TutorProfile per user
- ✅ One review per booking (verified feedback enforcement)
- ✅ Role-based access controlled at application layer
- ✅ Authentication session persistence
- ✅ Normalized relational schema
- ✅ Enum-based state management

---

# 🧠 Architectural Strengths

- Clear separation between authentication models and domain models
- Scalable availability modeling
- Extensible booking lifecycle
- Enforced review authenticity via booking relation
- Serverless-compatible PostgreSQL design


# 📡 API Structure

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

## Tutors

```
GET    /api/tutors
GET    /api/tutors/:id
```

## Bookings

```
POST   /api/bookings
GET    /api/bookings
PATCH  /api/bookings/:id
```

## Admin

```
GET    /api/admin/users
PATCH  /api/admin/users/:id
```

---

# ⚠️ Error Handling & UX

## Backend

- Zod validation
- Centralized error middleware
- Proper HTTP status codes

## Frontend

- TanStack Query loading states
- Skeleton components
- Toast notifications
- Form validation feedback

---

# ⚡ Performance Optimizations

- Server-side rendering (SSR)
- Query caching via TanStack Query
- Optimized Prisma queries
- Lazy-loaded components
- Serverless auto-scaling

---

# 🛠 Local Setup

## 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/learnhub.git
cd learnhub
```

## 2️⃣ Environment Variables

Create `.env` file:

```
DATABASE_URL=Your Database URL
BETTER_AUTH_SECRET=Better auth Secret
NEXT_PUBLIC_CLIENT_URL=Your frontend url
NEXT_PUBLIC_BACKEND_URL=Your backend url
```

## 3️⃣ Install Dependencies

```
npm install
```

## 4️⃣ Prisma Setup

```
npx prisma generate
npx prisma migrate dev
```

## 5️⃣ Run Development Server

```
npm run dev
```

---

# 🛡 Security Measures

- Server-side session verification
- Role-based middleware enforcement
- Banned-user restriction
- Environment variable protection
- Verified reviews linked to bookings

---

# 📈 Future Improvements

- Payment integration
- Real-time chat
- Email notifications
- Calendar sync
- Advanced filtering & pagination
- Analytics dashboard

---

# 👨‍💻 Author

Arpan Dey  
Full Stack Developer

GitHub: https://github.com/Arpan-Dey-Web  
Portfolio: https://arpandeyweb.vercel.app
