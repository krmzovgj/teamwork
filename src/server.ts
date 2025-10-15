import express from "express";
import { Server } from "socket.io";
import errorHandler from "./middleware/error-handler.ts";
import authRouter from "./routes//auth.routes.ts";
import userRouter from "./routes/user.route.ts";
import workspaceRouter from './routes/workspace.route.ts'

const app = express();

const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);
    socket.emit("message", "Welcome to chat app");
});

// Parse JSON requests
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/workspace", workspaceRouter)

// Use error handler middleware

app.use(errorHandler);
