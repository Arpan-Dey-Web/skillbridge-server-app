
import { Role } from "../constants/role";

declare global {
    namespace Express {
        interface User {
            id: string;
            role: Role;
            email: string;
            name?: string;
            image?: string | null;
            emailVerified: boolean;
        }

        interface Request {
            user?: User;
        }
    }
}

export { };