import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";
import groupRoutes from "./routes/group.route.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); // Increase the payload size limit
app.use(cookieParser());
app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);

			const allowedOrigins =
				process.env.NODE_ENV === "production"
					? [
							process.env.FRONTEND_URL,
							"https://vibein-beryl.vercel.app",
							"https://vibein-bercel.vercel.app",
					  ]
					: ["http://localhost:5173", "http://localhost:3000"];

			if (
				allowedOrigins.some((allowed) =>
					origin.includes(
						allowed.replace("https://", "").replace("http://", "")
					)
				)
			) {
				return callback(null, true);
			}

			return callback(null, true); // Allow all for now to fix the issue
		},
		credentials: true,
	})
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
	});
}

server.listen(PORT, () => {
	console.log("server is running on PORT:" + PORT);
	connectDB();
});

// Export for Vercel
export default app;
