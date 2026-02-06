const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const castingroutes =require("./routes/castingRoutes");
const applicationRoutes=require("./routes/applicationRoutes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());


// connect to database
connectDB();

app.use("/uploads", express.static("uploads"));




// routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/castings",castingroutes);
app.use('/api/applications',applicationRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ message: "Casting & Audition Backend Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
