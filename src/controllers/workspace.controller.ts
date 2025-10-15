import { UserRole, Workspace } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma.ts";

interface WorkspaceRequest extends Request {
    user?: {
        id: number;
        role: UserRole;
    };
}

// @desc Create a workspace
// @route POST /

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

        if(!userId) {
            return res.status(400).json({
                messsage: "User id must be provided!"
            })
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
                role: "OWNER",
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

// @desc Get Workspace by Id
// route GET /:id

export const getWorkspaceById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const workspaceId = req.params.id;

    if (!workspaceId) {
        return res.status(400).json({
            message: "Workspace id must be provided!",
        });
    }

    const workspace = await prisma.workspace.findUnique({
        where: {
            id: workspaceId,
        },
    });

    if (!workspace) {
        return res.status(404).json({
            message: "Workspace not found",
        });
    }

    res.status(200).json({
        workspace,
    });
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

    if (role === "MEMBER") {
        return res.status(401).json({
            message: "Premission denied",
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

// @desc Join workspace
// @route PATCH /:inviteCode

export const joinWorkspace = async (
    req: WorkspaceRequest,
    res: Response,
    next: NextFunction
) => {
    const inviteCode = req.params.inviteCode;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(400).json({
            message: "User id must be provided!",
        });
    }

    if (!inviteCode) {
        return res.status(400).json({
            message: "Invite code must be provided!",
        });
    }

    const workspace = await prisma.workspace.findUnique({
        where: {
            inviteCode
        }
    })

    if(!workspace) {
        return res.status(404).json({
            message: "Workspace not found"
        })
    }

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            workspaceId: workspace?.id,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: false,
            workspaceId: true,
            role: true,
        }
    });

    res.status(200).json({
        user
    })
};

// @desc Delete workspace
// @route DELETE /:id

export const deleteWorkspace = async (
    req: WorkspaceRequest,
    res: Response,
    next: NextFunction
) => {
    const role = req.user?.role;
    const workspaceId = req.params.id;

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

    const workspace = await prisma.workspace.delete({
        where: {
            id: workspaceId,
        },
    });

    if (!workspace) {
        return res.status(404).json({
            message: "Workspace not found",
        });
    }

    res.status(200).json({
        message: "Workspace deleted",
    });
};
