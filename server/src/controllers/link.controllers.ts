import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/AsyncHandler";
import prisma from "@/utils/PrismaClient";
import { Request, Response } from "express";

// Redirect to link
const redirectLink = asyncHandler(async (req: Request, res: Response) => {
    const alias = req.query.alias as string;

    if (!alias) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Alias not found"));
    }

    const link = await prisma.link.findUnique({
        where: { alias },
        select: { targetUrl: true },
    });

    if (!link) {
        const notFoundURL = process.env.CLIENT_URL + "/not-found";
        return res.redirect(notFoundURL);
    }

    return res.redirect(link.targetUrl);
});

// Create a link
const createLink = asyncHandler(async (req: Request, res: Response) => {
    const { alias, targetUrl, userId, altName } = req.body;

    const link = await prisma.link.create({
        data: {
            alias,
            altName,
            targetUrl,
            User: { connect: { id: userId } },
        },
    });

    return res.status(200).json(new ApiResponse(200, link, "Link created"));
});

//Getting user's links from db
const getUserLinks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const links = await prisma.link.findMany({
        where: { userId },
    });

    return res.status(200).json(new ApiResponse(200, links, "Links found"));
});

export { redirectLink, createLink, getUserLinks };
