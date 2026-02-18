// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nmodel User {\n  id            String  @id\n  email         String  @unique\n  name          String?\n  phone         String?\n  image         String?\n  emailVerified Boolean @default(false)\n\n  role   Role       @default(STUDENT)\n  status UserStatus @default(ACTIVE)\n\n  sessions Session[]\n  accounts Account[]\n\n  tutorProfile TutorProfile?\n  bookings     Booking[]\n  reviews      Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id     String         @id @default(uuid())\n  name   String         @unique\n  tutors TutorProfile[]\n\n  @@map("categories")\n}\n\nmodel TutorProfile {\n  id            String @id @default(uuid())\n  bio           String @db.Text\n  hourlyRate    Float\n  averageRating Float  @default(0.0)\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id])\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  availability Availability[]\n  bookings     Booking[]\n\n  @@map("tutor_profiles")\n}\n\nmodel Availability {\n  id        String @id @default(uuid())\n  dayOfWeek Int\n  startTime String\n  endTime   String\n\n  tutorProfileId String\n  tutor          TutorProfile @relation(fields: [tutorProfileId], references: [id])\n\n  @@map("availability")\n}\n\nmodel Booking {\n  id        String   @id @default(uuid())\n  startTime DateTime\n\n  endTime    DateTime\n  duration   Int?\n  totalPrice Float?\n  status     BookingStatus @default(PENDING)\n  meetLink   String?\n\n  studentId String\n  student   User   @relation(fields: [studentId], references: [id])\n\n  tutorProfileId String\n  tutor          TutorProfile @relation(fields: [tutorProfileId], references: [id])\n\n  review Review?\n\n  createdAt DateTime @default(now())\n\n  @@map("bookings")\n}\n\nmodel Review {\n  id        String   @id @default(uuid())\n  rating    Int\n  comment   String?  @db.Text\n  createdAt DateTime @default(now())\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id])\n\n  studentId String\n  student   User   @relation(fields: [studentId], references: [id])\n\n  @@map("reviews")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tutors","kind":"object","type":"TutorProfile","relationName":"CategoryToTutorProfile"}],"dbName":"categories"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"}],"dbName":"tutor_profiles"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"dayOfWeek","kind":"scalar","type":"Int"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"}],"dbName":"availability"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"meetLink","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"bookings"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"}],"dbName":"reviews"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  plugins: [
    bearer()
    // <--- Add this here
  ],
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "https://skillbridge-client-app.vercel.app"
  ],
  // --- ADD THIS SECTION ---
  cookie: {
    name: "better-auth",
    attributes: {
      sameSite: "none",
      // Allows cross-site cookie sharing
      secure: true
      // Required when sameSite is 'none'
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent"
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  }
});

// src/modules/categorie/categorie.routes.ts
import { Router } from "express";

// src/modules/categorie/categorie.service.ts
var createCategory = async (name) => {
  return await prisma.category.create({
    data: { name: name.trim() }
  });
};
var updateCategory = async (id, name) => {
  return await prisma.category.update({
    where: { id },
    data: { name: name.trim() }
  });
};
var deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id }
  });
};
var getAllCategories = async () => {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: { tutors: true }
      }
    }
  });
};
var getTutorsByCategory = async (categoryName, page, limit) => {
  const skip = (page - 1) * limit;
  const result = await prisma.category.findUnique({
    where: { name: categoryName },
    include: {
      tutors: {
        where: {
          user: { status: "ACTIVE" }
        },
        include: {
          user: {
            select: { name: true, image: true }
          },
          category: true
        },
        take: limit,
        skip,
        orderBy: { averageRating: "desc" }
      },
      _count: {
        select: {
          tutors: {
            where: { user: { status: "ACTIVE" } }
          }
        }
      }
    }
  });
  return result;
};
var categorieService = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getTutorsByCategory
};

// src/modules/categorie/categorie.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    const category = await categorieService.createCategory(name);
    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};
var updateCategory2 = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await categorieService.updateCategory(id, name);
  res.status(200).json({ success: true, data: result });
};
var deleteCategory2 = async (req, res) => {
  const { id } = req.params;
  await categorieService.deleteCategory(id);
  res.status(200).json({ success: true, message: "Category deleted" });
};
var getAllCategories2 = async (req, res) => {
  const result = await categorieService.getAllCategories();
  res.status(200).json({ success: true, data: result });
};
var getTutorsByCategory2 = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await categorieService.getTutorsByCategory(categoryName, page, limit);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    const totalCount = result._count.tutors;
    res.status(200).json({
      success: true,
      category: result.name,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      },
      data: result.tutors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};
var categorieController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  getTutorsByCategory: getTutorsByCategory2
};

// src/middleware/authorize.ts
var authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          if (Array.isArray(value)) {
            headers.append(key, value.join(", "));
          } else {
            headers.append(key, value);
          }
        }
      }
      const session = await auth.api.getSession({
        headers
      });
      if (!session?.user) {
        console.log("No session found for headers:", req.headers.authorization);
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { id, role, ...rest } = session.user;
      if (!id || !role) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = {
        id,
        role,
        ...rest
      };
      if (allowedRoles.length > 0 && !allowedRoles.includes(req?.user?.role)) {
        return res.status(403).json({
          message: "Forbidden: insufficient permissions"
        });
      }
      return next();
    } catch (error) {
      console.error("BETTER_AUTH_INTERNAL_ERROR:", error);
      return res.status(401).json({
        message: "Unauthorized",
        error: error.message
      });
    }
  };
};

// src/modules/categorie/categorie.routes.ts
var router = Router();
router.get("/", categorieController.getAllCategories);
router.get("/:categoryName/tutors", categorieController.getTutorsByCategory);
router.post("/", authorize("ADMIN"), categorieController.createCategory);
router.patch("/:id", authorize("ADMIN"), categorieController.updateCategory);
router.delete("/:id", authorize("ADMIN"), categorieController.deleteCategory);
var CategoryRoutes = router;

// src/modules/tutor/tutor.routes.ts
import { Router as Router2 } from "express";

// src/modules/tutor/tutor.service.ts
var upsertTutorProfile = async (payload) => {
  const { userId, bio, hourlyRate, categoryId } = payload;
  if (!userId) throw new Error("User ID is required");
  return await prisma.$transaction(async (tx) => {
    const profile = await tx.tutorProfile.upsert({
      where: { userId },
      update: { bio, hourlyRate, categoryId },
      create: { userId, bio, hourlyRate, categoryId }
    });
    await tx.user.update({
      where: { id: userId },
      data: { role: "TUTOR" }
    });
    return profile;
  });
};
var updateAvailability = async (userId, scheduleData) => {
  const SHIFT_CONFIG_DATA = [
    { id: "morning", start: "11:00 AM", end: "01:00 PM" },
    { id: "afternoon", start: "04:00 PM", end: "06:00 PM" },
    { id: "night", start: "09:00 PM", end: "11:00 PM" }
  ];
  return await prisma.$transaction(async (tx) => {
    const profile = await tx.tutorProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Tutor profile not found.");
    await tx.availability.deleteMany({ where: { tutorProfileId: profile.id } });
    const uniqueSlots = /* @__PURE__ */ new Map();
    Object.entries(scheduleData).forEach(([day, shifts]) => {
      const dayNum = parseInt(day) % 7;
      if (Array.isArray(shifts)) {
        shifts.forEach((shiftId) => {
          const config2 = SHIFT_CONFIG_DATA.find((s) => s.id === shiftId);
          if (config2) {
            const slotKey = `${dayNum}-${config2.start}`;
            if (!uniqueSlots.has(slotKey)) {
              uniqueSlots.set(slotKey, {
                tutorProfileId: profile.id,
                dayOfWeek: dayNum,
                startTime: config2.start,
                endTime: config2.end
              });
            }
          }
        });
      }
    });
    const availabilityData = Array.from(uniqueSlots.values());
    if (availabilityData.length === 0) return [];
    return await tx.availability.createMany({
      data: availabilityData
    });
  });
};
var getTutorAvailability = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new Error("Tutor profile not found. Please set up your profile first.");
  }
  const availability = await prisma.availability.findMany({
    where: { tutorProfileId: profile.id },
    orderBy: { dayOfWeek: "asc" }
  });
  return availability;
};
var getTutorProfileByUserId = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      category: true
      // Fetches category name/details
    }
  });
  if (!profile) throw new Error("Tutor profile not found");
  return profile;
};
var getTutorStats = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      averageRating: true
    }
  });
  if (!profile) {
    throw new Error("Tutor profile not found");
  }
  const [bookingStats, totalStudents] = await Promise.all([
    prisma.booking.aggregate({
      where: {
        tutorProfileId: profile.id,
        status: "COMPLETED"
        // Only count earned money from completed sessions
      },
      _sum: {
        totalPrice: true
      },
      _count: {
        id: true
      }
    }),
    prisma.booking.groupBy({
      by: ["studentId"],
      where: { tutorProfileId: profile.id },
      _count: true
    })
  ]);
  return {
    totalEarnings: bookingStats._sum.totalPrice || 0,
    completedSessions: bookingStats._count.id || 0,
    totalStudents: totalStudents.length,
    averageRating: profile.averageRating
  };
};
var tutorService = {
  upsertTutorProfile,
  updateAvailability,
  getTutorAvailability,
  getTutorStats,
  getTutorProfileByUserId
};

// src/modules/tutor/tutor.controller.ts
var setupTutorProfile = async (req, res) => {
  try {
    const result = await tutorService.upsertTutorProfile(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var updateAvailability2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const { schedule } = req.body;
    const result = await tutorService.updateAvailability(userId, schedule);
    res.status(200).json({ success: true, message: "Availability updated", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getTutorAvailability2 = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await tutorService.getTutorAvailability(tutorId);
    res.status(200).json({
      success: true,
      message: "Availability fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};
var getTutorStats2 = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const stats = await tutorService.getTutorStats(userId);
    res.status(200).json({
      success: true,
      message: "Tutor statistics fetched successfully",
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch stats"
    });
  }
};
var getTutorProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await tutorService.getTutorProfileByUserId(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var tutorController = {
  setupTutorProfile,
  updateAvailability: updateAvailability2,
  getTutorAvailability: getTutorAvailability2,
  getTutorStats: getTutorStats2,
  getTutorProfile
};

// src/modules/tutor/tutor.routes.ts
var router2 = Router2();
router2.put("/profile", authorize("TUTOR"), tutorController.setupTutorProfile);
router2.put("/availability", authorize("TUTOR"), tutorController.updateAvailability);
router2.get("/availability/:tutorId", tutorController.getTutorAvailability);
router2.get("/stats/:userId", tutorController.getTutorStats);
router2.get("/profile/:userId", authorize("TUTOR"), tutorController.getTutorProfile);
var TutorRoutes = router2;

// src/modules/review/review.routes.ts
import { Router as Router3 } from "express";

// src/modules/review/review.service.ts
var createReview = async (data) => {
  return await prisma.$transaction(async (tx) => {
    const existingReview = await tx.review.findUnique({
      where: { bookingId: data.bookingId }
    });
    if (existingReview) {
      throw new Error("You have already submitted a review for this session.");
    }
    const review = await tx.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        bookingId: data.bookingId,
        // Ensure this field exists in your Schema
        studentId: data.studentId
      },
      include: { booking: true }
    });
    await tx.booking.update({
      where: { id: data.bookingId },
      data: { status: "COMPLETED" }
    });
    const tutorId = review.booking.tutorProfileId;
    const aggregations = await tx.review.aggregate({
      _avg: { rating: true },
      where: { booking: { tutorProfileId: tutorId } }
    });
    await tx.tutorProfile.update({
      where: { id: tutorId },
      data: { averageRating: aggregations._avg.rating || 0 }
    });
    return review;
  });
};
var getTutorReviews = async (userId) => {
  return await prisma.review.findMany({
    where: {
      booking: {
        tutor: {
          userId
        }
      }
    },
    include: {
      student: {
        select: {
          name: true,
          image: true
        }
      },
      booking: {
        select: {
          startTime: true,
          status: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var reviewService = {
  createReview,
  getTutorReviews
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const { rating, comment, bookingId } = req.body;
    const studentId = req.user?.id;
    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and Rating are required"
      });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }
    const review = await reviewService.createReview({
      studentId,
      rating,
      comment,
      bookingId
    });
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create review"
    });
  }
};
var getMyReviews = async (req, res) => {
  try {
    const tutorId = req.user?.id;
    if (!tutorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Tutor ID not found"
      });
    }
    const reviews = await reviewService.getTutorReviews(tutorId);
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch your reviews"
    });
  }
};
var reviewController = {
  createReview: createReview2,
  getMyReviews
};

// src/modules/review/review.routes.ts
var router3 = Router3();
router3.post("/", authorize("STUDENT"), reviewController.createReview);
router3.get("/", authorize("TUTOR"), reviewController.getMyReviews);
var ReviewRouter = router3;

// src/modules/booking/booking.routes.ts
import { Router as Router4 } from "express";

// src/modules/booking/booking.service.ts
var createBooking = async (data) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: data.tutorProfileId },
    select: { hourlyRate: true }
  });
  if (!tutor) throw new Error("Tutor profile not found");
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format provided");
  }
  const durationInHours = (end.getTime() - start.getTime()) / (1e3 * 60 * 60);
  if (durationInHours <= 0) throw new Error("End time must be after start time");
  const totalPrice = durationInHours * tutor.hourlyRate;
  return await prisma.booking.create({
    data: {
      startTime: start,
      endTime: end,
      totalPrice,
      status: BookingStatus.PENDING,
      student: { connect: { id: data.studentId } },
      tutor: { connect: { id: data.tutorProfileId } }
    }
  });
};
var getPendingTutorBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: {
      // Check the status
      status: "PENDING",
      // Reach through the TutorProfile to the User table
      tutor: {
        userId
      }
    },
    include: {
      student: {
        select: {
          name: true,
          image: true,
          email: true
        }
      },
      // Including tutor info helps debug if the mapping is correct
      tutor: true
    },
    orderBy: {
      startTime: "asc"
    }
  });
};
var getUserBookings = async (userId, role) => {
  const isTutor = role === "TUTOR";
  const bookings = await prisma.booking.findMany({
    where: isTutor ? { tutor: { userId } } : { studentId: userId },
    include: {
      student: {
        select: { name: true, image: true, email: true }
      },
      tutor: {
        include: {
          user: {
            select: { name: true, image: true, email: true }
          }
        }
      }
    },
    orderBy: { startTime: "desc" }
  });
  const formatTime2 = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };
  return bookings.map((booking) => {
    const partner = isTutor ? booking.student : booking.tutor.user;
    return {
      id: booking.id,
      status: booking.status,
      totalPrice: booking.totalPrice,
      // Format dates for easier frontend consumption
      date: booking.startTime.toISOString().split("T")[0],
      timeSlot: `${formatTime2(booking.startTime)} - ${formatTime2(booking.endTime)}`,
      // --- ADDED FIELD ---
      meetLink: booking.meetLink,
      // Partner info
      partnerName: partner?.name || "Unknown User",
      partnerImage: partner?.image,
      partnerEmail: partner?.email,
      // Original raw dates
      startTime: booking.startTime,
      endTime: booking.endTime
    };
  });
};
var getAllBookings = async (userId, role) => {
  const isTutor = role === "TUTOR";
  const isAdmin = role === "ADMIN";
  const whereClause = isAdmin ? {} : isTutor ? { tutor: { userId } } : { studentId: userId };
  const bookings = await prisma.booking.findMany({
    where: whereClause,
    include: {
      student: {
        select: { id: true, name: true, image: true, email: true }
      },
      tutor: {
        include: {
          user: {
            select: { name: true, image: true, email: true }
          }
        }
      }
    },
    orderBy: { startTime: "desc" }
  });
  return bookings.map((booking) => {
    return {
      id: booking.id,
      status: booking.status,
      totalPrice: booking.totalPrice,
      date: booking.startTime.toISOString().split("T")[0],
      timeSlot: `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
      // Helpful for Admin Dashboard tables
      studentName: booking.student?.name,
      tutorName: booking.tutor?.user?.name,
      // Standard "Partner" logic for standard users
      partnerName: isAdmin ? `S: ${booking.student?.name} | T: ${booking.tutor?.user?.name}` : isTutor ? booking.student?.name : booking.tutor?.user?.name,
      startTime: booking.startTime,
      endTime: booking.endTime
    };
  });
};
var approveBooking = async (bookingId, meetLink, tutorUserId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.tutor.userId !== tutorUserId) {
    throw new Error("You are not authorized to approve this booking");
  }
  return await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CONFIRMED",
      meetLink
    }
  });
};
var formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};
var deleteBooking = async (bookingId, tutorUserId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.tutor.userId !== tutorUserId) {
    throw new Error("You are not authorized to reject this booking");
  }
  return await prisma.booking.delete({
    where: { id: bookingId }
  });
};
var bookingService = {
  createBooking,
  getUserBookings,
  getAllBookings,
  approveBooking,
  getPendingTutorBookings,
  deleteBooking
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res) => {
  try {
    const { startTime, endTime, tutorProfileId } = req.body;
    const studentId = req.user?.id;
    const result = await bookingService.createBooking({
      startTime,
      //
      endTime,
      //
      studentId,
      tutorProfileId
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var getPendingRequests = async (req, res) => {
  try {
    const userId = req.user?.id;
    const result = await bookingService.getPendingTutorBookings(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getMyBookings = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const result = await bookingService.getUserBookings(userId, role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getAllBookings2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const result = await bookingService.getAllBookings(userId, role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var approveBooking2 = async (req, res) => {
  console.log("object");
  try {
    const { id } = req.params;
    const { meetLink } = req.body;
    const user = req.user;
    if (!meetLink || !meetLink.startsWith("https://meet")) {
      return res.status(400).json({
        success: false,
        message: "Invalid Meet Link! Must start with 'https://meet'"
      });
    }
    const result = await bookingService.approveBooking(id, meetLink, user.id);
    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: result
    });
  } catch (error) {
    const statusCode = error.message.includes("authorized") ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};
var deleteBooking2 = async (req, res) => {
  try {
    const { id } = req.params;
    const tutorUserId = req.user?.id;
    const result = await bookingService.deleteBooking(id, tutorUserId);
    res.status(200).json({
      success: true,
      message: "Booking request rejected and removed",
      data: result
    });
  } catch (error) {
    const statusCode = error.message.includes("authorized") ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete booking"
    });
  }
};
var bookingController = {
  createBooking: createBooking2,
  getMyBookings,
  getAllBookings: getAllBookings2,
  approveBooking: approveBooking2,
  getPendingRequests,
  deleteBooking: deleteBooking2
};

// src/modules/booking/booking.routes.ts
var router4 = Router4();
router4.post("/", authorize("STUDENT"), bookingController.createBooking);
router4.get("/", bookingController.getMyBookings);
router4.get("/pending", authorize("TUTOR"), bookingController.getPendingRequests);
router4.get("/all", authorize("ADMIN"), bookingController.getAllBookings);
router4.patch("/approve/:id", authorize("TUTOR"), bookingController.approveBooking);
router4.delete("/:id", authorize("TUTOR"), bookingController.deleteBooking);
var BookingRoutes = router4;

// src/modules/tutors/tutors.routes.ts
import { Router as Router5 } from "express";

// src/modules/tutors/tutors.service.ts
var getAllTutors = async (filters) => {
  const { page = 1, limit = 10, sortBy = "averageRating" } = filters;
  const skip = (page - 1) * limit;
  const where = {
    user: { status: "ACTIVE" }
  };
  if (filters.category) where.category = { name: filters.category };
  if (filters.search) {
    where.OR = [
      { bio: { contains: filters.search, mode: "insensitive" } },
      { user: { name: { contains: filters.search, mode: "insensitive" } } }
    ];
  }
  where.hourlyRate = {
    gte: filters.minPrice ?? 0,
    lte: filters.maxPrice ?? 999999
  };
  const totalCount = await prisma.tutorProfile.count({ where });
  const tutors = await prisma.tutorProfile.findMany({
    where,
    include: {
      user: { select: { name: true, image: true } },
      category: true
    },
    orderBy: { [sortBy]: "desc" },
    // dynamic sorting
    skip,
    take: limit
  });
  return { tutors, totalCount };
};
var getTutorById = async (id) => {
  return await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      // 1. Get basic user info (Name, Image)
      user: {
        select: {
          name: true,
          image: true,
          email: true
        }
      },
      // 2. Get the category details
      category: true,
      // 3. Get the availability slots for the tutor
      availability: true,
      // 4. Get reviews through the bookings relationship
      bookings: {
        where: {
          status: "COMPLETED",
          // Usually, we only show reviews for completed sessions
          review: { isNot: null }
          // Only get bookings that actually have a review
        },
        include: {
          review: {
            include: {
              student: {
                select: {
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      }
    }
  });
};
var getFeaturedTutors = async () => {
  return await prisma.tutorProfile.findMany({
    where: {
      user: { status: "ACTIVE" }
    },
    take: 6,
    include: {
      user: {
        select: {
          name: true,
          image: true,
          createdAt: true
          // Optional: if you need to show "Joined on..."
        }
      },
      category: true
    },
    orderBy: {
      // Access the createdAt field inside the user relation
      user: {
        createdAt: "desc"
      }
    }
  });
};
var tutorsService = {
  getAllTutors,
  getTutorById,
  getFeaturedTutors
};

// src/modules/tutors/tutors.controller.ts
var getTutors = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page, limit, sortBy } = req.query;
    const filters = {
      category,
      search,
      minPrice: minPrice ? Number(minPrice) : void 0,
      maxPrice: maxPrice ? Number(maxPrice) : void 0,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sortBy: sortBy || "averageRating"
    };
    const { tutors, totalCount } = await tutorsService.getAllTutors(filters);
    res.status(200).json({
      success: true,
      totalCount,
      page: filters.page,
      totalPages: Math.ceil(totalCount / filters.limit),
      data: tutors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getFirstSixTutors = async (req, res) => {
  try {
    const tutors = await tutorsService.getFeaturedTutors();
    res.status(200).json({
      success: true,
      message: "First 6 tutors fetched successfully",
      count: tutors.length,
      data: tutors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tutors"
    });
  }
};
var getTutorById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const tutor = await tutorsService.getTutorById(id);
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found"
      });
    }
    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tutor details"
    });
  }
};
var tutorsController = {
  getTutors,
  getTutorById: getTutorById2,
  getFirstSixTutors
};

// src/modules/tutors/tutors.routes.ts
var router5 = Router5();
router5.get("/", tutorsController.getTutors);
router5.get("/all", tutorsController.getTutors);
router5.get("/:id", tutorsController.getTutorById);
var tutorsRoutes = router5;

// src/modules/admin/admin.routes.ts
import { Router as Router6 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tutorProfile: {
        include: {
          category: true
          // টিউটর হলে কোন ক্যাটাগরির তাও দেখাবে
        }
      },
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 10
        // সর্বশেষ ১০টি বুকিং দেখাবে
      },
      _count: {
        select: {
          bookings: true,
          reviews: true
        }
      }
    }
  });
};
var updateUserStatus = async (userId, status) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status }
  });
};
var getPlatformStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalBookings = await prisma.booking.count();
  const totalTutors = await prisma.tutorProfile.count();
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  return { totalUsers, totalBookings, totalTutors, totalStudents };
};
var getDashboardSummary = async () => {
  const [
    userCount,
    tutorCount,
    categoryCount,
    bookingCount,
    recentBookings,
    totalRevenue
  ] = await Promise.all([
    prisma.user.count(),
    prisma.tutorProfile.count(),
    prisma.category.count(),
    prisma.booking.count(),
    // লেটেস্ট ৫টি বুকিং স্টুডেন্ট এবং টিউটরের নামসহ
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { name: true } },
        tutor: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    }),
    // টোটাল রেভিনিউ ক্যালকুলেশন (বুকিং এর totalPrice যোগফল)
    prisma.booking.aggregate({
      where: { status: "COMPLETED" },
      _sum: { totalPrice: true }
    })
  ]);
  return {
    userCount,
    tutorCount,
    categoryCount,
    bookingCount,
    recentBookings,
    totalRevenue: totalRevenue._sum.totalPrice || 0
  };
};
var adminService = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  getPlatformStats,
  getDashboardSummary
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getuser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await adminService.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in the records."
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};
var toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["ACTIVE", "BANNED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Must be ACTIVE or BANNED."
      });
    }
    const updatedUser = await adminService.updateUserStatus(id, status);
    res.status(200).json({
      success: true,
      message: `User successfully ${status === "BANNED" ? "banned" : "unbanned"}`,
      data: updatedUser
    });
  } catch (error) {
    const message = error.code === "P2025" ? "User not found" : error.message;
    res.status(400).json({ success: false, message });
  }
};
var getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getPlatformStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getDashboardSummary2 = async (req, res) => {
  try {
    const data = await adminService.getDashboardSummary();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error.message
    });
  }
};
var adminController = {
  getAllUsers: getAllUsers2,
  getuser,
  toggleUserStatus,
  getDashboardStats,
  getDashboardSummary: getDashboardSummary2
};

// src/modules/admin/admin.routes.ts
var router6 = Router6();
router6.get("/", authorize("ADMIN"), adminController.getDashboardStats);
router6.get("/users", authorize("ADMIN"), adminController.getAllUsers);
router6.get("/user/:id", authorize("ADMIN"), adminController.getuser);
router6.get("/dashboard-summary", adminController.getDashboardSummary);
router6.patch("/users/:id", authorize("ADMIN"), adminController.toggleUserStatus);
var AdminRoutes = router6;

// src/modules/users/users.routes.ts
import { Router as Router7 } from "express";

// src/modules/users/users.service.ts
var getUserStats = async () => {
  const [total, tutors, students, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TUTOR" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "ADMIN" } })
  ]);
  const thirtyDaysAgo = /* @__PURE__ */ new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentJoins = await prisma.user.count({
    where: {
      createdAt: { gte: thirtyDaysAgo }
    }
  });
  return {
    total,
    tutors,
    students,
    admins,
    recentJoins,
    growthPercentage: total > 0 ? (recentJoins / total * 100).toFixed(1) : 0
  };
};
var userService = {
  getUserStats
};

// src/modules/users/users.controller.ts
var getStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var userController = {
  getStats
};

// src/modules/users/users.routes.ts
var router7 = Router7();
router7.get("/stats", authorize("ADMIN"), userController.getStats);
var UserRoutes = router7;

// src/app.ts
var app = express();
var port = process.env.PORT || 8e3;
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL
  // Production frontend URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/skillbridge-client-app.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/categories", CategoryRoutes);
app.use("/api/tutor", TutorRoutes);
app.use("/api/tutors", tutorsRoutes);
app.use("/api/reviews", ReviewRouter);
app.use("/api/bookings", BookingRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/users", UserRoutes);
app.get("/", (req, res) => {
  res.send(`Learnhub App Running on PORT: ${port}`);
});
var app_default = app;

// src/server.ts
var port2 = process.env.PORT || 8e3;
async function main() {
  try {
    await prisma.$connect();
    app_default.listen(port2, () => {
      console.log(`Server Runing on http://localhost:${port2}`);
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
