
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from './prisma';


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "STUDENT",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    // databaseHooks: {
    //     user: {
    //         create: {
    //             after: async (user) => {
    //                 if (user.role === "TUTOR") {
    //                     await prisma.tutorProfile.create({
    //                         data: {
    //                             userId: user.id,
    //                             bio: "Welcome to my tutor profile! Please update your bio.",
    //                             hourlyRate: 0,
    //                             subjects: [],                             
    //                             categoryId: 1,
    //                         },
    //                     });
    //                 }
    //             },
    //         },
    //     },
    // },
    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent",
        },
    }
});