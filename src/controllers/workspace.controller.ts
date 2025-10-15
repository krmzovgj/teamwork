import { Workspace } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma.ts";

// @desc Create a workspace
// @route POST /

interface CreateWorkspaceRequest extends Request {
    user?: {
        id: number;
    };
}

export const createWorkspace = async (
    req: CreateWorkspaceRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Workspace name must be provided",
            });
        }

        let inviteCode = "";
        let exists: Workspace | null = null;

        do {
            inviteCode = Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();
            exists = await prisma.workspace.findUnique({
                where: { inviteCode },
            });
        } while (exists !== null);

        const workspace = await prisma.workspace.create({
            data: {
                name,
                inviteCode,
                users: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role: "ADMIN",
                workspaceId: workspace.id,
            },
        });

        res.status(201).json({
            workspace,
        });
    } catch (error) {
        next(error);
    }
};
