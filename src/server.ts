import express from "express";
import cors from "cors";
import errorHandler from "./middleware/error-handler.js";

const PORT = process.env.PORT || 8080;

const server = express();

// Parse JSON requests
server.use(express.json());

//Allow origins
server.use(cors());

server.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

server.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
