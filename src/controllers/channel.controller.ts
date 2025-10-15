import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma.ts";

interface ChannelRequest extends Request {
    user?: {
        id: number;
        role: UserRole;
    };
}

// @desc Create channel
// @route POST /:workspaceId

export const createChannel = async (
    req: ChannelRequest,
    res: Response,
    next: NextFunction
) => {
    const role = req.user?.role;
    const workspaceId = req.params.workspaceId;
    const { name } = req.body;

    if (role === "MEMBER") {
        return res.status(401).json({
            message: "Premission denied",
        });
    }

    if (!workspaceId) {
        return res.status(400).json({
            message: "Workspace id must be provided!",
        });
    }

    const channel = await prisma.channel.create({
        data: {
            name,
            workspace: {
                connect: {
                    id: workspaceId,
                },
            },
        },
    });

    res.status(201).json({
        channel,
    });
};

// @desc Get Channel By Id
// @route GET /:id

export const getChannelById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const channelId = parseInt(req.params.id);

    if (!channelId) {
        return res.status(400).json({
            message: "Channel id must be provided!",
        });
    }

    const channel = await prisma.channel.findUnique({
        where: {
            id: channelId,
        },
    });

    if (!channel) {
        return res.status(404).json({
            message: "Channel not found",
        });
    }

    res.status(200).json({
        channel,
    });
};

// @desc Update Channel
// @route PATCH /:id

export const updateChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const channelId = parseInt(req.params.id);
    const { name } = req.body;

    if (!channelId) {
        return res.status(400).json({
            message: "Channel id must be provided!",
        });
    }

    const channel = await prisma.channel.update({
        where: {
            id: channelId,
        },
        data: {
            name,
        },
    });

    if (!channel) {
        return res.status(404).json({
            message: "Channel not found",
        });
    }

    res.status(200).json({
        channel,
    });
};

// @desc Delete channel
// @route DELETE /:id

export const deleteChannel = async (
    req: ChannelRequest,
    res: Response,
    next: NextFunction
) => {
    const role = req.user?.role;
    const channelId = parseInt(req.params.id);

    if (role === "MEMBER") {
        return res.status(401).json({
            message: "Premission denied",
        });
    }

    if (!channelId) {
        return res.status(400).json({
            message: "Channel id must be provided!",
        });
    }

    const deletedChannel = await prisma.channel.delete({
        where: { id: channelId },
    });

    if (!deleteChannel) {
        return res.status(400).json({
            message: "Channel not found",
        });
    }

    res.status(200).json({
        message: "Channel deleted",
    });
};
