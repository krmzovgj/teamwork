// @desc Get user by Id
// @route /GET /:id

import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma.ts";

interface UserRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: UserRole;
        workspaceId: string;
    };
}

export const getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);

    if (!userId) {
        res.status(400).json({ message: "User id must be proveded!" });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: false,
            role: true,
            workspaceId: true
        },
    });

    if (!user) {
        res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
};

// @desc Update user
// @route PUT /:id

export const updateUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    const currentEmail = req.user?.email;
    const userId = parseInt(req.params.id);
    const { firstName, lastName, email, role } = req.body;

    if (!userId) {
        res.status(400).json({
            message: "User id is required",
        });
    }

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            firstName,
            lastName,
            email: email,
            role
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: false,
            role: true,
            workspaceId: true
        }
    });

    if (!user) {
        res.status(400).json({
            message: "User not found",
        });
    }

    if (currentEmail !== email) {
        return res.json({
            message: "Email updated, sign out required",
            forceSignOut: true,
            user,
        });
    }

    res.status(200).json({
        user,
    });
};

// @desc Delete user
// @route DELETE /:id

export const deleteUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = parseInt(req.params.id);

    if (!userId) {
        return res.status(400).json({
            message: "User id must be provided!",
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (user?.role === "OWNER" && user.workspaceId) {
        await prisma.workspace.delete({
            where: {
                id: user.workspaceId,
            },
            include: {
                channels: true,
                users: true,
            },
        });
    }

    const deletedUser = await prisma.user.delete({
        where: {
            id: userId,
        },
    });

    if (!deletedUser) {
        return res.status(400).json({
            message: "Failed to delete user",
        });
    }

    res.status(200).json({
        message: "User deleted",
    });
};
