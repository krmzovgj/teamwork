import { NextFunction, Request, Response } from "express";

export interface CustomError extends Error {
    statusCode?: number;
}

const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong!";

    if (statusCode === 404) {
        message = "Not Found";
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorHandler;
