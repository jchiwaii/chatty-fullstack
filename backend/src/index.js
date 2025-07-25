import express from "express";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Manual CORS setup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control"
  );

  if (req.method === "OPTIONS") {
    console.log("Handling preflight request for:", req.url);
    res.status(200).end();
    return;
  }

  next();
});

// Increase payload limits for image uploads
app.use(
  express.json({
    limit: "50mb", // Increased from 10mb to 50mb
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Chatty API is running!" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
