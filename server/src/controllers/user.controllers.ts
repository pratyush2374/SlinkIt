import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/AsyncHandler";
import prisma from "@/utils/PrismaClient";
import sendVerifyCode from "@/utils/SendVerificationCode";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ApiError from "@/utils/ApiError";
import generateAccessAndRefreshToken from "@/utils/generateTokens";

// Controller for sending verification code
const sendCode = asyncHandler(async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!email) {
        return res.status(400).json(new ApiError(400, "Email not found"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json(new ApiError(400, "Invalid email format"));
    }

    const verifyCode = Math.floor(Math.random() * 10000);

    await sendVerifyCode(name, email, verifyCode);

    return res
        .status(200)
        .json(new ApiResponse(200, { verifyCode }, "Verification code sent"));
});

// Controller for signing up a user
const signUp = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        return res
            .status(400)
            .json(new ApiError(400, "Email or password not found"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json(new ApiError(400, "Invalid email format"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            refreshToken: "",
            password: hashedPassword,
        },
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user.id
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { userId: user.id, refreshToken: user.refreshToken },
                "User signed up successfully"
            )
        );
});

//Controller for signing in a user
const signIn = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json(new ApiError(400, "Email or password not found"));
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(400).json(new ApiError(400, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json(new ApiError(400, "Invalid password"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user.id
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { userId: user.id, refreshToken: user.refreshToken },
                "User signed in successfully"
            )
        );
});

// Controller for refreshing tokens
const refreshBothTokens = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        userId
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { userId, refreshToken },
                "Tokens refreshed successfully"
            )
        );
});

//Controller for signing out a user
const signOut = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: "" },
    });

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, null, "User signed out"));
});

export { sendCode, signUp, signIn, refreshBothTokens, signOut };
