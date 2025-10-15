// @desc Get user by Id
// @route /GET /:id

import { NextFunction, Request, Response } from "express";
import prisma from "../prisma.ts";

interface UpdateUserRequest extends Request {
    user?: {
        id: number,
        email: string
    }
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
    req: UpdateUserRequest,
    res: Response,
    next: NextFunction
) => {

    const currentEmail = req.user?.email
    const userId = parseInt(req.params.id);
    const { firstName, lastName, email } = req.body;

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
        },
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
            user
        })
    }

    res.status(200).json({
        user,
    });
};
