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

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id)

    socket.on("joinWorkspace", (workspaceId) => {
        socket.join(workspaceId)
        console.log(`User ${socket.id} joined workspace ${workspaceId}`)
    })

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
    })
})

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/workspace", workspaceRouter);
app.use("/channel", channelRouter);
app.use("/message", messageRouter);

// Use error handler middleware
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})
