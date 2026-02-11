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




const updateAvailability = async (userId: string, scheduleData: any) => {
    const SHIFT_CONFIG_DATA = [
        { id: "morning", start: "11:00 AM", end: "01:00 PM" },
        { id: "afternoon", start: "04:00 PM", end: "06:00 PM" },
        { id: "night", start: "09:00 PM", end: "11:00 PM" },
    ];
    return await prisma.$transaction(async (tx) => {
        const profile = await tx.tutorProfile.findUnique({ where: { userId } });
        if (!profile) throw new Error("Tutor profile not found.");

        // ১. আগের সব স্লট মুছে ফেলা
        await tx.availability.deleteMany({ where: { tutorProfileId: profile.id } });

        // ২. ফ্রন্টএন্ডের অবজেক্ট { 1: ["morning", "night"], 2: [...] } কে 
        // ডাটাবেস ফ্রেন্ডলি অ্যারেতে রূপান্তর করা
        const availabilityData: any[] = [];

        Object.entries(scheduleData).forEach(([day, shifts]: [string, any]) => {
            shifts.forEach((shiftId: string) => {
                // SHIFT_CONFIG থেকে সময় খুঁজে বের করা (অথবা হার্ডকোড করা)
                const config = SHIFT_CONFIG_DATA.find(s => s.id === shiftId);
                if (config) {
                    availabilityData.push({
                        tutorProfileId: profile.id,
                        dayOfWeek: parseInt(day),
                        startTime: config.start, // "11:00 AM"
                        endTime: config.end,     // "01:00 PM"
                    });
                }
            });
        });

        if (availabilityData.length === 0) return [];

        return await tx.availability.createMany({
            data: availabilityData
        });
    });
};

const getTutorAvailability = async (userId: string) => {
    // ১. প্রথমে প্রোফাইল চেক করুন
    const profile = await prisma.tutorProfile.findUnique({
        where: { userId },
    });

    if (!profile) {
        // প্রোফাইলই না থাকলে এরর দিন কারণ তাকে আগে প্রোফাইল ক্রিয়েট করতে হবে
        throw new Error("Tutor profile not found. Please set up your profile first.");
    }

    // ২. এভেইল্যাবিলিটি খুঁজুন
    const availability = await prisma.availability.findMany({
        where: { tutorProfileId: profile.id },
        orderBy: { dayOfWeek: 'asc' },
    });

    // ডাটা না থাকলেও এটি [] রিটার্ন করবে, যা ৪MD এরর আটকাবে
    return availability;
}
const getTutorProfileByUserId = async (userId: string) => {
    const profile = await prisma.tutorProfile.findUnique({
        where: { userId },
        include: {
            category: true // Fetches category name/details
        }
    });

    if (!profile) throw new Error("Tutor profile not found");
    return profile;
};


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
    getTutorStats,
    getTutorProfileByUserId
};