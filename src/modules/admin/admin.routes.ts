import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();



// GET /api/admin 
router.get("/", adminController.getDashboardStats);

// GET /api/admin/users - Get all users
router.get("/users", adminController.getAllUsers);

// PATCH /api/admin/users/:id - Update status (Ban/Unban)
router.patch("/users/:id", adminController.toggleUserStatus);




export const AdminRoutes = router;