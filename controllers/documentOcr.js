require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const { ImageAnnotatorClient } = require("@google-cloud/vision");
const processFile = require("../middleware/documentOcr");
const uuid = require("uuid");
const path = require("path");
const { formatTextDetectionFromDocumentApiRes } = require("../utils");

const keyFilePath = path.join(__dirname, "..", "key.json");

exports.postDocumentOcr = async (req, res, next) => {
  try {
    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

    await processFile(req, res);

    const oldFileName = req.file.originalname;
    let generatedUuid = uuid.v4();
    const newFileName = generatedUuid + path.extname(oldFileName);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(newFileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      const inputConfig = {
        mimeType: "application/pdf",
        gcsSource: {
          uri: `gs://${process.env.GOOGLE_CLOUD_BUCKET_NAME}/${newFileName}`,
        },
      };
      const outputConfig = {
        gcsDestination: {
          uri: `gs://${process.env.GOOGLE_CLOUD_BUCKET_NAME}/${generatedUuid}-`,
        },
      };
      const features = [{ type: "DOCUMENT_TEXT_DETECTION" }];
      const request = {
        requests: [
          {
            inputConfig: inputConfig,
            features: features,
            outputConfig: outputConfig,
          },
        ],
      };

      const [operation] = await client.asyncBatchAnnotateFiles(request);
      const [filesResponse] = await operation.promise();

      const [files] = await storage
        .bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME)
        .getFiles({
          prefix: `${generatedUuid}-output-`,
        });

      const contents = await files[0].download();
      let jsonContent = JSON.parse(contents);

      res.status(200).send({
        message: "Ocr Performed successfully.",
        data: formatTextDetectionFromDocumentApiRes(jsonContent),
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).send({
      message: `Failed to perform ocr on this document, Please try again.`,
    });
  }
};

const client = new ImageAnnotatorClient({
  keyFilename: keyFilePath,
});

const storage = new Storage({ keyFilename: keyFilePath });
