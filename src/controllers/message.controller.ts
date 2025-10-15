import { NextFunction, Request, Response } from "express";

// @desc Create a message
// @route POST /:channelId

export const createMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const channelId = parseInt(req.params.channelId);
    const { content, userId } = req.body;

    if (!channelId) {
        return res.status(400).json({
            message: "Channel id must be provided",
        });
    }

    if (!userId) {
        return res.status(400).json({
            message: "User id must be provided",
        });
    }

    const message = await prisma?.message.create({
        data: {
            content,
            userId,
            channelId,
        },
    });

    res.status(201).json({
        message,
    });
};
