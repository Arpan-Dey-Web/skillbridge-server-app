// src/modules/user/user.service.ts
import { prisma } from "../../../lib/prisma";

const getUserStats = async () => {
    // Get counts for all roles in parallel
    const [total, tutors, students, admins] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "TUTOR" } }),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "ADMIN" } }),
    ]);

    // Optional: Get users joined in the last 30 days for a "Growth" metric
    const thirtyDaysAgo = new Date();
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
        growthPercentage: total > 0 ? ((recentJoins / total) * 100).toFixed(1) : 0
    };
};

export const userService = {
    getUserStats
};