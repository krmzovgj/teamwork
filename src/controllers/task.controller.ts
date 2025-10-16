import { NextFunction, Request, Response } from "express";
import { io } from "../server.ts";

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
        include: {
            assignee: true,
            channel: true,
        },
    });

    io.to(channelId.toString()).emit("newTask", {
        task,
        message: `New task created in channel ${task?.channel.name}`,
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

    try {
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
            select: {
                id: true,
                name: true,
                priority: true,
                status: true,
                assigneeId: true,
                channelId: true,
                createdAt: true,
                updatedAt: true,
                channel: { select: { id: true, name: true } },
                assignee: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });

        io.to(updatedTask!.channelId.toString()).emit("taskUpdated", {
            task: updatedTask,
            message: `Task updated in ${updatedTask!.channel.name}`,
        });

        res.status(200).json({
            updatedTask,
        });
    } catch {
        return res.status(404).json({
            message: "Task not found",
        });
    }
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

    try {
        const deletedTask = await prisma?.task.delete({
            where: {
                id: taskId,
            },
        });

        io.to(deletedTask!.channelId.toString()).emit("taskDeleted", {
            taskId: deletedTask?.id,
            message: `Task '${deletedTask!.name}' was deleted`,
        });

        res.status(200).json({
            message: "Task deleted",
        });
    } catch (error) {
        return res.status(404).json({
            message: "Task not found",
        });
    }
};
