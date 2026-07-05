import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const tokenSecret = process.env.JWT_SECRET!;
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ message: "Authorization header missing" })
    }


    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid Authorization format."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
    const decoded = jwt.verify(token, tokenSecret) as jwt.JwtPayload;

    req.user = {
        id: decoded.id,
        email: decoded.email,
    };

    next()

    } catch {
    return res.status(401).json({
        message: "Invalid or expired token."
    });
}
    
}