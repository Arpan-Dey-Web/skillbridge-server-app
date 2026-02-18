declare global {
    namespace Express {
        interface User {
            id: string;
            role: "ADMIN" | "TUTOR" | "STUDENT";
            email: string;
            name?: string | undefined;
            image?: string | null | undefined;
            emailVerified: boolean;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        }

        interface Request {
            user?: User;
        }
    }
}

export { };