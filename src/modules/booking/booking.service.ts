import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";


const createBooking = async (data: {
    startTime: string;
    endTime: string;
    studentId: string;
    tutorProfileId: string;
}) => {
    // 1. Get tutor's hourly rate to calculate total price
    const tutor = await prisma.tutorProfile.findUnique({
        where: { id: data.tutorProfileId },
        select: { hourlyRate: true }
    });

    if (!tutor) throw new Error("Tutor profile not found");

    // 2. Calculate duration in hours
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (durationInHours <= 0) throw new Error("End time must be after start time");

    const totalPrice = durationInHours * tutor.hourlyRate;

    // 3. Create the booking
    return await prisma.booking.create({
        data: {
            startTime: start,
            endTime: end,
            totalPrice,
            status: BookingStatus.CONFIRMED,
            student: { connect: { id: data.studentId } },
            tutor: { connect: { id: data.tutorProfileId } }
        }
    });
};

const getUserBookings = async (userId: string, role: string) => {
    if (role === 'TUTOR') {
        return await prisma.booking.findMany({
            where: { tutor: { userId: userId } },
            include: { student: true }
        });
    }
    return await prisma.booking.findMany({
        where: { studentId: userId },
        include: { tutor: { include: { user: true } } }
    });
};

export const bookingService = {
    createBooking,
    getUserBookings
};