import { NextFunction, Request, Response } from "express";
import { io } from "../server.ts";

// @desc Create a message
// @route POST /:channelId

interface MessageRequest extends Request {
    user?: {
        id: number;
    };
}

export const createMessage = async (
    req: MessageRequest,
    res: Response,
    next: NextFunction
) => {
    const channelId = parseInt(req.params.channelId);
    const { content } = req.body;
    const userId = req.user?.id;

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
        include: {
            User: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });

    if (!message) {
        return res.status(404).json({
            message: "Channel not found",
        });
    }

    io.to(channelId.toString()).emit("newMessage", {
        messageId: message?.id,
        content: message?.content,
        channelId: message?.channelId,
        user: {
            id: message?.User.id,
            name: `${message?.User.firstName} ${message?.User.lastName}`,
        },
        createdAt: message?.createdAt,
    });

    res.status(201).json({
        message,
    });
};

// @desc Edit message
// @route PUT /:id

export const updateMessage = async (
    req: MessageRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    const messageId = parseInt(req.params.id);
    const { content } = req.body;

    if (!userId) {
        return res.status(400).json({
            message: "User id must be provided!",
        });
    }

    if (!messageId) {
        return res.status(400).json({
            message: "Message id must be provided!",
        });
    }

    const message = await prisma?.message.update({
        where: { id: messageId, userId },
        data: {
            content,
        },
        select: {
            id: true,
            content: true,
            User: {
                select: {
                    id: true,
                },
            },
            Channel: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!message) {
        return res.status(404).json({
            message: "Message not found",
        });
    }

    io.to(message.Channel.id.toString()).emit("messageUpdated", {
        messageId: message.id,
        name: message.content,
        message: `Message updated`,
    });

    res.status(200).json({
        message,
    });
};

// @desc Delete message
// @route DELETE /:id

export const deleteMessage = async (
    req: MessageRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    const messageId = parseInt(req.params.id);

    if (!userId) {
        return res.status(400).json({
            message: "User id must be provided!",
        });
    }

    if (!messageId) {
        return res.status(400).json({
            message: "Message id must be provided!",
        });
    }

    const deletedMessage = await prisma?.message.delete({
        where: {
            id: messageId,
            userId,
        },
        select: {
            id: true,
            channelId: true,
            content: true,
        },
    });

    if (!deletedMessage) {
        return res.status(404).json({
            message: "Message not found!",
        });
    }

    io.to(deletedMessage.channelId.toString()).emit("messageDeleted", {
        messageId: deletedMessage.id,
        name: deletedMessage.content,
        message: `Message Deleted`,
    });

    res.status(200).json({
        message: "Message deleted",
    });
};
