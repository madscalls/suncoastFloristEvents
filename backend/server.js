const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: path.join(__dirname, "uploads/") });
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

app.post("/api/submit-wedding", upload.array("attachments"), (req, res) => {
  const formFields = req.body;
  const uploadedFiles = req.files || [];

  // TODO: integrate Google Drive / Docs API here.
  // Use the uploadedFiles array and formFields object to create a folder,
  // generate a document with the responses, and upload the files.

  console.log("Wedding form received:", { formFields, uploadedFiles });

  res.json({
    success: true,
    message:
      "Wedding form received. Backend scaffold is ready for Google Drive integration.",
    receivedFiles: uploadedFiles.length,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
