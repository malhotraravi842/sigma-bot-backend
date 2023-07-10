const express = require("express");
const imageOcrControllers = require("../controllers/imageOcr");
const documentOcrControllers = require("../controllers/documentOcr");
const router = express.Router();

router.post("/ocr/image", imageOcrControllers.postImageOcr);

router.post("/ocr/document", documentOcrControllers.postDocumentOcr);

module.exports = router;
