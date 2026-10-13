import { Request, Response, NextFunction } from 'express';
import prisma from "../config/prisma.js"

export const adminMiddleware = async( req: Request, res: Response, next: NextFunction ) => {
    try {

        if(!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                role: true,
            },
        })

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: Admin access only" });
        }

        next();

    } catch (error) {
          console.error("Admin authorization error:", error);

        return res.status(500).json({
         message: "Failed to verify admin permissions.",
        });
    }
}