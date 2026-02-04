import { prisma } from "../../../lib/prisma";

const upsertTutorProfile = async (payload: any) => {
    const { userId, bio, hourlyRate, categoryId } = payload;

    if (!userId) {
        throw new Error("User ID is required to setup a profile.");
    }
    // We use upsert so that if the tutor clicks "Finish Setup" twice, 
    // it updates their bio instead of crashing with a "Duplicate" error.
    const result = await prisma.tutorProfile.upsert({
        where: {
            userId: userId, // userId is unique in your schema
        },
        update: {
            bio,
            hourlyRate,
            categoryId,
        },
        create: {
            userId,
            bio,
            hourlyRate,
            categoryId,
        },
    });

    // Optional: Update the User's role to TUTOR once they finish setup
    await prisma.user.update({
        where: { id: userId },
        data: { role: 'TUTOR' }
    });

    return result;
};


export const tutorService = {
    upsertTutorProfile,
}