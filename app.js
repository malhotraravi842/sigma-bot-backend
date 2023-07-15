require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ocrRoutes = require("./routes/ocr");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json({ limit: process.env.FILE_UPLOAD_LIMIT }));

app.use(ocrRoutes);

app.use("/", (req, res, next) => {
  res.send("<h1>Hello, Backend is live</h1>");
});

app.listen(process.env.PORT);
