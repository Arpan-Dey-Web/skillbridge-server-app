import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getuser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await adminService.getUserById(id as string);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'ACTIVE' অথবা 'BANNED'

        // স্ট্যাটাস ভ্যালিডেশন
        if (!['ACTIVE', 'BANNED'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value. Must be ACTIVE or BANNED."
            });
        }

        const updatedUser = await adminService.updateUserStatus(id as string, status);

        res.status(200).json({
            success: true,
            message: `User successfully ${status === 'BANNED' ? 'banned' : 'unbanned'}`,
            data: updatedUser
        });
    } catch (error: any) {
        // Prisma error handling (P2025: Record not found)
        const message = error.code === 'P2025' ? "User not found" : error.message;
        res.status(400).json({ success: false, message });
    }
};

const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getPlatformStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const data = await adminService.getDashboardSummary();
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard summary",
            error: error.message
        });
    }
};


export const adminController = {
    getAllUsers,
    getuser,
    toggleUserStatus,
    getDashboardStats,
    getDashboardSummary
};