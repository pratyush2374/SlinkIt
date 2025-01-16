import ApiError from "@/utils/ApiError";
import asyncHandler from "@/utils/AsyncHandler";
import prisma from "@/utils/PrismaClient";
import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token =
            req.headers.authorization?.split(" ")[1] ||
            req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json(new ApiError(401, "Unauthorized"));
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as { id: string };

        if (!decodedToken) {
            return res.status(401).json(new ApiError(401, "Unauthorized"));
        }

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
        });

        if (!user) {
            return res.status(401).json(new ApiError(401, "Unauthorized"));
        }

        req.user = user;

        return next();
    }
);

export default verifyJwt;
