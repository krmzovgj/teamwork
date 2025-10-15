import { UserRole, Workspace } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma.ts";

// @desc Create a workspace
// @route POST /

interface WorkspaceRequest extends Request {
    user?: {
        id: number;
        role: UserRole;
    };
}

export const createWorkspace = async (
    req: WorkspaceRequest,
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

// @desc Update Workspace
// @route PATCH /:id

export const updateWorkspace = async (
    req: WorkspaceRequest,
    res: Response,
    next: NextFunction
) => {
    const role = req.user?.role;
    const workspaceId = req.params.id;
    const { name } = req.body;

    if (role !== "ADMIN") {
        return res.status(401).json({
            message: "Premission Denied",
        });
    }

    if (!workspaceId) {
        return res
            .status(400)
            .json({ message: "Workspace id must be proveded!" });
    }

    const workspace = await prisma.workspace.update({
        where: {
            id: workspaceId,
        },
        data: {
            name,
        },
    });

    if (!workspace) {
        return res.status(404).json({
            message: "Workspace not found",
        });
    }

    res.status(200).json({ workspace });
};
