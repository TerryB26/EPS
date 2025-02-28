import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const baseUploadDir = path.join(process.cwd(), 'EmployeeFiles', 'Contracts');

// Ensure the base directory exists
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

export default function handler(req, res) {
  const form = formidable({
    keepExtensions: true,
    filename: (name, ext, part) => `${Date.now()}_${part.originalFilename}`,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing the files', err);
      return res.status(500).json({ error: 'Error parsing the files' });
    }

    const userId = fields.userId;
    const userUploadDir = path.join(baseUploadDir, userId);

    // Ensure the user-specific directory exists
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }

    // Handle single file upload
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const oldPath = file.filepath;
    const newPath = path.join(userUploadDir, file.newFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('Error moving the file', err);
        return res.status(500).json({ error: 'Error moving the file' });
      }

      console.log('Files uploaded successfully', files);
      res.status(200).json({ message: 'Files uploaded successfully', files });
    });
  });
}