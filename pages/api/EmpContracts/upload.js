import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "empContracts");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default function handler(req, res) {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => `${Date.now()}_${part.originalFilename}`,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing the files", err);
      return res.status(500).json({ error: "Error parsing the files" });
    }

    res.status(200).json({ message: "Files uploaded successfully", files });
  });
}
