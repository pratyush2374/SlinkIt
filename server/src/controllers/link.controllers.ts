import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/AsyncHandler";
import prisma from "@/utils/PrismaClient";
import { Request, Response } from "express";

// Redirect to link
const redirectLink = asyncHandler(async (req: Request, res: Response) => {
    const { alias } = req.body;

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
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Link not found"));
    }
    const linkToSend = {
        redirectUrl: link.targetUrl,
    };
    return res.status(200).json(new ApiResponse(200, linkToSend, "Link found"));
});

// Create a link
const createLink = asyncHandler(async (req: Request, res: Response) => {
    const { alias, targetUrl, altName } = req.body;

    if (!alias || !targetUrl) {
        return res
            .status(400)
            .json(new ApiError(400, "Alias or targetUrl not found"));
    }

    const targetUrlRegex =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;

    if (!targetUrlRegex.test(targetUrl)) {
        return res
            .status(400)
            .json(new ApiError(400, "Invalid targetUrl format"));
    }

    const aliasExists = await prisma.link.findUnique({
        where: { alias },
    });

    if (aliasExists) {
        return res.status(400).json(new ApiError(400, "Alias already exists"));
    }

    const alternateName = altName || "Link";

    const linkData: any = {
        alias,
        altName: alternateName,
        targetUrl,
    };

    if (req.user?.id) {
        linkData.User = { connect: { id: req.user.id } };
    }

    const link = await prisma.link.create({
        data: linkData,
    });

    return res.status(200).json(new ApiResponse(200, link, "Link created"));
});

//Getting user's links from db
const getUserLinks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const links = await prisma.link.findMany({
        where: { userId },
        select: {
            alias: true,
            altName: true,
            targetUrl: true,
        },
    });

    return res.status(200).json(new ApiResponse(200, links, "Links found"));
});

//Deleting link by alias
const deleteAlias = asyncHandler(async (req: Request, res: Response) => {
    const { alias } = req.body;

    if (!alias) {
        return res.status(400).json(new ApiError(400, "Alias not found"));
    }

    const link = await prisma.link.delete({
        where: { alias },
    });

    return res.status(200).json(new ApiResponse(200, link, "Link deleted"));
});

export { redirectLink, createLink, getUserLinks, deleteAlias };
