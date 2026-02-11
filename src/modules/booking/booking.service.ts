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

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format provided");
    }

    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (durationInHours <= 0) throw new Error("End time must be after start time");

    const totalPrice = durationInHours * tutor.hourlyRate;

    // 3. Create the booking
    return await prisma.booking.create({
        data: {
            startTime: start,
            endTime: end,
            totalPrice,
            status: BookingStatus.PENDING,
            student: { connect: { id: data.studentId } },
            tutor: { connect: { id: data.tutorProfileId } }
        }
    });
};

const getPendingTutorBookings = async (userId: string) => {
    return await prisma.booking.findMany({
        where: {
            // Check the status
            status: "PENDING",
            // Reach through the TutorProfile to the User table
            tutor: {
                userId: userId
            }
        },
        include: {
            student: {
                select: {
                    name: true,
                    image: true,
                    email: true
                }
            },
            // Including tutor info helps debug if the mapping is correct
            tutor: true
        },
        orderBy: {
            startTime: 'asc'
        }
    });
};



const getUserBookings = async (userId: string, role: string) => {
    const isTutor = role === 'TUTOR';

    const bookings = await prisma.booking.findMany({
        where: isTutor ? { tutor: { userId: userId } } : { studentId: userId },
        include: {
            student: {
                select: { name: true, image: true, email: true }
            },
            tutor: {
                include: {
                    user: {
                        select: { name: true, image: true, email: true }
                    }
                }
            }
        },
        orderBy: { startTime: 'desc' }
    });

    // Transform data to be "User Friendly"
    return bookings.map((booking) => {
        // Determine who the "Other Person" in the booking is
        const partner = isTutor ? booking.student : booking.tutor.user;

        return {
            id: booking.id,
            status: booking.status,
            totalPrice: booking.totalPrice,
            // Format dates for easier frontend consumption
            date: booking.startTime.toISOString().split('T')[0],
            timeSlot: `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
            // Partner info (The person the user is meeting with)
            partnerName: partner?.name || "Unknown User",
            partnerImage: partner?.image,
            partnerEmail: partner?.email,
            // Original raw dates just in case
            startTime: booking.startTime,
            endTime: booking.endTime,
        };
    });
};


const getAllBookings = async (userId: string, role: string) => {
    const isTutor = role === 'TUTOR';
    const isAdmin = role === 'ADMIN';
    const whereClause = isAdmin
        ? {}
        : isTutor
            ? { tutor: { userId: userId } }
            : { studentId: userId };

    const bookings = await prisma.booking.findMany({
        where: whereClause,
        include: {
            student: {
                select: { id: true, name: true, image: true, email: true }
            },
            tutor: {
                include: {
                    user: {
                        select: { name: true, image: true, email: true }
                    }
                }
            }
        },
        orderBy: { startTime: 'desc' }
    });

    return bookings.map((booking) => {
        // For Admin view, it's better to return both parties clearly
        return {
            id: booking.id,
            status: booking.status,
            totalPrice: booking.totalPrice,
            date: booking.startTime.toISOString().split('T')[0],
            timeSlot: `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`,

            // Helpful for Admin Dashboard tables
            studentName: booking.student?.name,
            tutorName: booking.tutor?.user?.name,

            // Standard "Partner" logic for standard users
            partnerName: isAdmin ? `S: ${booking.student?.name} | T: ${booking.tutor?.user?.name}` :
                isTutor ? booking.student?.name : booking.tutor?.user?.name,

            startTime: booking.startTime,
            endTime: booking.endTime,
        };
    });
};



const approveBooking = async (bookingId: string, meetLink: string, tutorUserId: string) => {
    // ১. চেক করুন এই বুকিংটি আসলেই এই টিউটরের কি না (Security Check)
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { tutor: true }
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    // ২. নিশ্চিত করুন যে টিউটর নিজেই এটি অ্যাপ্রুভ করছেন
    if (booking.tutor.userId !== tutorUserId) {
        throw new Error("You are not authorized to approve this booking");
    }

    // ৩. আপডেট অপারেশন
    return await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: "CONFIRMED",
            meetLink: meetLink,
        },
    });
};



const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};


export const bookingService = {
    createBooking,
    getUserBookings,
    getAllBookings,
    approveBooking,
    getPendingTutorBookings
};