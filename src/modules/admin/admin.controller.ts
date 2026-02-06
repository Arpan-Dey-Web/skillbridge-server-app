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

const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting 'ACTIVE' or 'BANNED'

        const updatedUser = await adminService.updateUserStatus(id as string, status);
        res.status(200).json({
            success: true,
            message: `User status updated to ${status}`,
            data: updatedUser
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
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



export const adminController = {
    getAllUsers,
    toggleUserStatus,
    getDashboardStats
};