import { NextFunction, Request, Response } from "express";

// @desc Create Task
// @route POST /:channelId

export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const channelId = parseInt(req.params.channelId);
    const { name, priority } = req.body;

    if (!channelId) {
        return res.status(400).json({
            message: "Channel id must be provided!",
        });
    }

    const task = await prisma?.task.create({
        data: {
            name,
            priority,
            channelId,
        },
        select: {
            id: true,
            name: true,
            assignee: true,
            assigneeId: true,
            status: true,
            priority: true,

            channel: true,
        },
    });

    res.status(201).json({
        task,
    });
};

// @desc Update task
// @route PATCH /:id

export const updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const taskId = parseInt(req.params.id);
    const { name, status, priority, assigneeId, channelId } = req.body;

    if (!taskId) {
        return res.status(400).json({
            message: "Task id must be provided!",
        });
    }

    console.log(channelId);

    const updatedTask = await prisma?.task.update({
        where: {
            id: taskId,
        },
        data: {
            name,
            status,
            priority,
            assignee: assigneeId
                ? { connect: { id: assigneeId } }
                : { disconnect: true },
            channel: {
                connect: { id: channelId },
            },
        },
    });

    if (!updatedTask) {
        return res.status(404).json({
            message: "Task not found",
        });
    }

    res.status(200).json({
        updatedTask,
    });
};

// @desc Delete Task
// @route DELETE /:id

export const deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const taskId = parseInt(req.params.id);

    if (!taskId) {
        return res.status(400).json({
            message: "Task id must be provided!",
        });
    }

    const deletedTask = await prisma?.task.deleteMany({
        where: {
            id: taskId,
        },
    });

    if (deletedTask?.count === 0) {
        return res.status(404).json({
            message: "Task not found",
        });
    }

    res.status(200).json({
        message: "Task deleted",
    });
};
