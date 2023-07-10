const express = require("express");
const ocrControllers = require("../controllers/ocr");
const router = express.Router();

router.post("/ocr", ocrControllers.postOcr);

module.exports = router;
