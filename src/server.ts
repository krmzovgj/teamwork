import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import errorHandler from "./middleware/error-handler.ts";
import authRouter from "./routes/auth.route.ts";
import userRouter from "./routes/user.route.ts";
import workspaceRouter from "./routes/workspace.route.ts";
import channelRouter from "./routes/channel.route.ts";
import messageRouter from "./routes/message.route.ts";
import taskRouter from './routes/task.route.ts'
import prisma from "./prisma.ts";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

export const onlineUsers = new Map<number, Set<string>>();

io.on("connection", async (socket) => {
    socket.on("register", async (user) => {
        const userId = Number(user.id);

        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId)!.add(socket.id);

        const dbUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                workspaceId: true,
                workspace: {
                    select: {
                        channels: { select: { id: true } },
                    },
                },
            },
        });

        if (dbUser?.workspaceId) {
            socket.join(dbUser.workspaceId);


            dbUser.workspace?.channels.forEach((channel) => {
                socket.join(channel.id.toString());
                console.log(`Socket ${socket.id} joined ${channel.id}`);
            });
        }
    });

    socket.on("disconnect", () => {
        onlineUsers.forEach((sockets, userId) => {
            sockets.delete(socket.id);
            if (sockets.size === 0) onlineUsers.delete(userId);
        });
    });
});

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});


app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/workspace", workspaceRouter);
app.use("/channel", channelRouter);
app.use("/message", messageRouter);
app.use("/task", taskRouter)

// Use error handler middleware
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
