import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/AsyncHandler";
import prisma from "@/utils/PrismaClient";
import sendVerifyCode from "@/utils/SendVerificationCode";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ApiError from "@/utils/ApiError";
import generateAccessAndRefreshToken from "@/utils/generateTokens";
import jwt from "jsonwebtoken";
import sendForgotPasswordLink from "@/utils/SendForgotPasswordLink";
import { CookieOptions } from "express";

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

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        return res
            .status(400)
            .json(new ApiError(400, "Email already exists please sign in"));
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

    const emailExists = await prisma.user.findUnique({
        where: { email },
    });

    if (emailExists) {
        return res
            .status(400)
            .json(new ApiError(400, "Email already exists please sign in"));
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

    const accessTokenExpiry = Date.now() + 1000 * 60 * 60 * 24;
    const refreshTokenExpiry = Date.now() + 1000 * 60 * 60 * 24 * 7;

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    const cookieOptions: CookieOptions = {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: '/',
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    userId: updatedUser.id,
                    accessTokenExpiry,
                    refreshTokenExpiry,
                },
                "User signed up successfully"
            )
        );
});

//Controller for signing in a user
const signIn = asyncHandler(async (req: Request, res: Response) => {
    console.log("Someone tried to sign in");
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

    const cookieOptions: CookieOptions = {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: '/',
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    accessTokenExpiry: Date.now() + 1000 * 60 * 60 * 24,
                    refreshTokenExpiry: Date.now() + 1000 * 60 * 60 * 24 * 7,
                },
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

    const refreshTokenExpiry = Date.now() + 1000 * 60 * 60 * 24 * 7;
    const accessTokenExpiry = Date.now() + 1000 * 60 * 60 * 24;

    const cookieOptions: CookieOptions = {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: '/',
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessTokenExpiry, refreshTokenExpiry },
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

    const cookieOptions: CookieOptions = {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: '/',
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, null, "User signed out"));
});

// Controller for sending forgot password link
const sendLinkForForgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json(new ApiError(400, "Email not found"));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json(new ApiError(400, "Invalid email format"));
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json(new ApiError(400, "User not found"));
        }

        const emailToken = jwt.sign(
            { email },
            process.env.FORGOT_PASSWORD_SECRET!,
            { expiresIn: "1d" }
        );

        const forgotPasswordLink = `${process.env.CLIENT_URL}/reset-password?token=${emailToken}`;

        await sendForgotPasswordLink(email, forgotPasswordLink);

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Link sent successfully"));
    }
);

// Controller for resetting password
interface JwtPayload {
    email: string;
    iat?: number;
    exp?: number;
}

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!password || !token) {
        return res
            .status(400)
            .json(new ApiError(400, "Password and token are required"));
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(
            token,
            process.env.FORGOT_PASSWORD_SECRET!
        ) as JwtPayload;

        if (!decodedToken.email) {
            return res
                .status(400)
                .json(new ApiError(400, "Invalid token format"));
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: decodedToken.email },
        });

        if (!existingUser) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password
        await prisma.user.update({
            where: { email: decodedToken.email },
            data: { password: hashedPassword },
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { email: decodedToken.email },
                    "Password reset successfully"
                )
            );
    } catch (error) {
        // Handle specific JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            if (error.name === "TokenExpiredError") {
                return res
                    .status(401)
                    .json(new ApiError(401, "Reset token has expired"));
            }
            return res
                .status(401)
                .json(new ApiError(401, "Invalid reset token"));
        }

        // Handle Prisma errors
        if (
            error instanceof Error &&
            error.name === "PrismaClientKnownRequestError"
        ) {
            return res
                .status(500)
                .json(new ApiError(500, "Database error occurred"));
        }

        // For any other unexpected errors
        return res
            .status(500)
            .json(new ApiError(500, "Error resetting password"));
    }
});

export {
    sendCode,
    signUp,
    signIn,
    refreshBothTokens,
    signOut,
    sendLinkForForgotPassword,
    resetPassword,
};
