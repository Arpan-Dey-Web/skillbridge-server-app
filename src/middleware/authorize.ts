// import { NextFunction, Request, Response } from "express";
// import { auth } from "../../lib/auth";


// type Role = "ADMIN" | "TUTOR" | "STUDENT";

// export const authorize = (...allowedRoles: Role[]) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {



//             const session = await auth.api.getSession({
//                 headers: new Headers(req.headers as Record<string, string>),
//             });

//             if (!session || !session.user) {
//                 return res.status(401).json({ message: "Unauthorized: No Session" });
//             }
//             req.user = session.user as any;

//             // 2. Role Check
//             if (allowedRoles.length > 0 && !allowedRoles.includes(req?.user?.role)) {
//                 return res.status(403).json({
//                     message: "Forbidden: Role mismatch",
//                     userRole: req?.user?.role
//                 });
//             }
//             next();
//         } catch (error) {
//             console.error("Authorize middleware error:", error);
//             return res.status(401).json({ message: "Unauthorized" });
//         }
//     };

import { RequestHandler } from "express";
import { auth } from "../../lib/auth";

type Role = "ADMIN" | "TUTOR" | "STUDENT";

export const authorize = (...allowedRoles: Role[]): RequestHandler => {
    return async (req, res, next) => {
        try {
            const headers = new Headers();
            for (const [key, value] of Object.entries(req.headers)) {
                if (value) {
                    if (Array.isArray(value)) {
                        headers.append(key, value.join(", "));
                    } else {
                        headers.append(key, value as string);
                    }
                }
            }
            const session = await auth.api.getSession({
                headers: headers,
            });
            if (!session?.user) {
                console.log("No session found for headers:", req.headers.authorization);
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Attach user data to request object
            const { id, role, ...rest } = session.user;

            if (!id || !role) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            req.user = {
                id,
                role: role as Role,
                ...rest,
            };

            if (allowedRoles.length > 0 && !allowedRoles.includes(req?.user?.role)) {
                return res.status(403).json({
                    message: "Forbidden: insufficient permissions",
                });
            }

            return next();
        } catch (error: any) {
            // This will log to your Vercel Dashboard -> Functions -> Logs
            console.error("BETTER_AUTH_INTERNAL_ERROR:", error);
            return res.status(401).json({
                message: "Unauthorized",
                error: error.message
            });
        }
    };
};

