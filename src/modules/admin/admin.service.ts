import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";


const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
    });
};


const updateUserStatus = async (userId: string, status: UserStatus) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status }
    });
};

const getPlatformStats = async () => {
    const userCount = await prisma.user.count();
    const bookingCount = await prisma.booking.count();
    const tutorCount = await prisma.tutorProfile.count();

    return { userCount, bookingCount, tutorCount };
};

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getPlatformStats
};