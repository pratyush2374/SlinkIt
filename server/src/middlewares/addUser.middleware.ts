import asyncHandler from "@/utils/AsyncHandler";
import prisma from "@/utils/PrismaClient";
import { Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const addUser = asyncHandler(async (req: Request, _, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    // If no token exists, continue without user
    if (!token) {
        return next();
    }

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as { id: string };

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
        });

        // If user not found, continue without user
        if (!user) {
            return next();
        }

        // Attach user to request
        req.user = user;
        return next();
    } catch (error) {
        // If token verification fails, continue without user
        return next();
    }
});

export default addUser;