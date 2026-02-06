import { Router } from "express";
import { adminController } from "./admin.controller";
import { authorize } from "../../middleware/authorize";

const router = Router();



// GET /api/admin 
router.get("/", authorize("ADMIN") ,adminController.getDashboardStats);

// GET /api/admin/users - Get all users
router.get("/users", authorize("ADMIN"), adminController.getAllUsers);

// PATCH /api/admin/users/:id - Update status (Ban/Unban)
router.patch("/users/:id", authorize("ADMIN"), adminController.toggleUserStatus);




export const AdminRoutes = router;