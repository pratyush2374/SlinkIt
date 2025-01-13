import ApiError from "@/utils/ApiError";
import asyncHandler from "@/utils/AsyncHandler";
import prisma from "@/utils/PrismaClient";
import { Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async (req: Request, _, next: NextFunction) => {
    const token =
        req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
    ) as { id: string };

    if (!decodedToken) {
        throw new ApiError(401, "Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
    });

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = user;

    next();
});

export default verifyJwt;
