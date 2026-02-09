// src/modules/user/user.controller.ts
import { Request, Response } from 'express';
import { userService } from './users.service';


const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await userService.getUserStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const userController = {
    getStats
};