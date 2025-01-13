import jwt from "jsonwebtoken";
import prisma from "./PrismaClient";

const generateAccessAndRefreshToken = async (
    userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const userForAccessToken = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const accessToken = jwt.sign(
            userForAccessToken,
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: "1d",
            }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET!,
            {
                expiresIn: "7d",
            }
        );

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken,
            },
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Failed to generate tokens");
    }
};

export default generateAccessAndRefreshToken;
