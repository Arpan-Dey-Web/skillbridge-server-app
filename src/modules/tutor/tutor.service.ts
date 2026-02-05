import { prisma } from "../../../lib/prisma";

const upsertTutorProfile = async (payload: any) => {
    const { userId, bio, hourlyRate, categoryId } = payload;
    if (!userId) throw new Error("User ID is required");

    return await prisma.$transaction(async (tx) => {
        // 1. Update/Create Profile
        const profile = await tx.tutorProfile.upsert({
            where: { userId },
            update: { bio, hourlyRate, categoryId },
            create: { userId, bio, hourlyRate, categoryId },
        });

        // 2. Ensure User role is TUTOR
        await tx.user.update({
            where: { id: userId },
            data: { role: 'TUTOR' }
        });

        return profile;
    });
};

const updateAvailability = async (userId: string, schedule: any[]) => {
    // We delete old availability and set new to keep it clean
    return await prisma.$transaction(async (tx) => {
        const profile = await tx.tutorProfile.findUnique({ where: { userId } });
        if (!profile) throw new Error("Tutor profile not found");

        await tx.availability.deleteMany({ where: { tutorProfileId: profile.id } });

        return await tx.availability.createMany({
            data: schedule.map(s => ({
                tutorProfileId: profile.id,
                dayOfWeek: s.dayOfWeek,
                startTime: s.startTime,
                endTime: s.endTime
            }))
        });
    });
};


const getTutorAvailability = async (userId: string) => {
    const profileWithAvailability = await prisma.tutorProfile.findUnique({
        where: { userId },
        include: {
            availability: {
                orderBy: {
                    dayOfWeek: 'asc',
                },
            },
        },
    });

    if (!profileWithAvailability) {
        throw new Error("Tutor profile not found");
    }

    return profileWithAvailability.availability;
}



const getTutorStats = async (userId: string) => {
    // 1. Get the Profile ID first
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

    // 2. Run parallel queries for efficiency
    const [bookingStats, totalStudents] = await Promise.all([
        prisma.booking.aggregate({
            where: {
                tutorProfileId: profile.id,
                status: 'COMPLETED' // Only count earned money from completed sessions
            },
            _sum: {
                totalPrice: true
            },
            _count: {
                id: true
            }
        }),
        prisma.booking.groupBy({
            by: ['studentId'],
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

export const tutorService = {
    upsertTutorProfile,
    updateAvailability,
    getTutorAvailability,
    getTutorStats
};