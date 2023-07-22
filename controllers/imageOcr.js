require("dotenv").config();
const vision = require("@google-cloud/vision");
const path = require("path");
const keyFilePath = path.join(__dirname, "..", "key.json");
const redactor = require("../utils/piidata");

exports.postImageOcr = async (req, res, next) => {
  let { base64Url } = req.body;
  if (!base64Url) {
    res
      .status(500)
      .json({ status: "failed", message: "base64Url is required" });
  }

  let data = {
    image: {
      content: base64Url.split(",")[1],
    },
  };

  // Performs text detection on the local file
  try {
    const [result] = await client.textDetection(data);
    const detections = result.textAnnotations;
    let parsedText = detections[0]?.description;
    let maskedText = await redactor.redactAsync(parsedText);
    res.status(200).json({ data: detections, maskedText });
  } catch (err) {
    res.status(500).json({ status: "failed" });
  }
};

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: keyFilePath,
});
