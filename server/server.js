require("dotenv").config({
  path: "./config.env",
});
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleWare/error");
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));
const PORT = process.env.PORT || 5000;

app.use(errorHandler);
const server = app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => {
    process.exit(1);
  });
});
app.get("/", (req, res) => {
  res.send("Welcome to CORS server 😁");
});
