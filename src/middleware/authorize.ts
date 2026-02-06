import { NextFunction, Request, Response } from "express";
import { auth } from "../../lib/auth";


type Role = "ADMIN" | "TUTOR" | "STUDENT";

export const authorize = (...allowedRoles: Role[]) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                //  Get session from headers (Postman) or cookies (browser)
                const session = await auth.api.getSession({
                    headers: req.headers as any, // pass cookies or auth headers
                });

                if (!session || !session.user) {
                    return res.status(401).json({ message: "You Can Not Acess. Unauthorized!!!" });
                }

                // attach user to request
                (req.user as any) = session.user;

                // Check allowed roles
                if (!req.user || !allowedRoles.includes(req.user.role)) {
                    return res
                        .status(403)
                        .json({ message: "Forbidden: You Don't To Not Acess This" });
                }

                // Everything ok
                next();
            } catch (error) {
                console.error("Authorize middleware error:", error);
                return res.status(401).json({ message: "Unauthorized" });
            }
        };