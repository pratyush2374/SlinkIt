import express, { Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiResponse from "./utils/ApiResponse";
import linkRouter from "./routes/link.routes";
import userRouter from "./routes/user.routes";

dotenv.config();

const app = express();

// Middleware
app.use(
    cors({
        origin: ["https://slinkit.netlify.app"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define PORT
const PORT = process.env.PORT || 3000;

// Routes
app.get("/", (_, res: Response) => {
    res.status(200).json(new ApiResponse(200, null, "Server is running"));
});

app.use("/api/link", linkRouter);
app.use("/api/user", userRouter);

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
