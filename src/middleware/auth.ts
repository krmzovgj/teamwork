import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number;
    };
}

export const verifyAccessToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized. Access Token is required",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: number;
        };

        req.user = (await prisma?.user.findUnique({
            where: {
                id: decoded.id,
            },
        })) as { id: number };

        next();
    } catch (error) {
        return res.status(403).json({
            message: "Forbidden - Invalid or expired token",
        });
    }
};
