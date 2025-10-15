import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc Create a user
// @route POST /create-account

export const createAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email & password are required" });
    }

    const existing = await prisma?.user.findUnique({
        where: { email },
    });

    if (existing) {
        return res.status(400).json({
            message: "User with that email already exists",
        });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma?.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashed,
        },
    });

    if (!user) {
        return res.status(400).json({
            message: "Failed to create user",
        });
    }

    res.status(201).json({
        user: {
            id: user.id,
            email: user.email,
        },
    });
};

// @desc Sign In
// @route POST /sign-in

export const signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const user = await prisma?.user.findUnique({
        where: { email },
    });

    const valid = bcrypt.compare(password, user?.password!);

    if (!valid) {
        return res.status(400).json({
            message: "Invalid credentials",
        });
    }

    const token = jwt.sign(
        { id: user?.id },
        process.env.JWT_SECRET!,
        { expiresIn: "30d" }
    );

    res.status(200).json({
        token,
    });
};
