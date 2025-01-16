import express, { Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiResponse from "./utils/ApiResponse";
import linkRouter from "./routes/link.routes";
import userRouter from "./routes/user.routes";

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://slinkit.netlify.app",
];

// Middleware
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    })
);
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
