import { NextFunction, Request, Response } from "express";
import { auth } from "../../lib/auth";


type Role = "ADMIN" | "TUTOR" | "STUDENT";

export const authorize = (...allowedRoles: Role[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers as any,
            });

            if (!session || !session.user) {
                return res.status(401).json({ message: "Unauthorized: No Session" });
            }
            req.user = session.user as any;

            // 2. Role Check
            if (allowedRoles.length > 0 && !allowedRoles.includes(req?.user?.role)) {
                return res.status(403).json({
                    message: "Forbidden: Role mismatch",
                    userRole: req?.user?.role
                });
            }
            next();
        } catch (error) {
            console.error("Authorize middleware error:", error);
            return res.status(401).json({ message: "Unauthorized" });
        }
    };