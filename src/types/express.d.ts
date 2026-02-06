
import { Role } from "../constants/role";

declare global {
    namespace Express {
        interface User {
            id: string;
            role: Role;
            email?: string;
        }

        interface Request {
            user?: User;
        }
    }
}

export { };