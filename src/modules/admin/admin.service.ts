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
const getUserById = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            tutorProfile: {
                include: {
                    category: true, // টিউটর হলে কোন ক্যাটাগরির তাও দেখাবে
                }
            },
            bookings: {
                orderBy: { createdAt: 'desc' },
                take: 10, // সর্বশেষ ১০টি বুকিং দেখাবে
            },
            _count: {
                select: {
                    bookings: true,
                    reviews: true,
                }
            }
        }
    });
}

const updateUserStatus = async (userId: string, status: UserStatus) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status }
    });
};

const getPlatformStats = async () => {
    const totalUsers = await prisma.user.count();
    const totalBookings = await prisma.booking.count();
    const totalTutors = await prisma.tutorProfile.count();
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

    return { totalUsers, totalBookings, totalTutors, totalStudents };
};

const getDashboardSummary = async () => {
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
            orderBy: { createdAt: 'desc' },
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
            where: { status: 'COMPLETED' },
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

export const adminService = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    getPlatformStats,
    getDashboardSummary
};