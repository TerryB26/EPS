import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const baseUploadDir = path.join(process.cwd(), 'EmployeeFiles', 'Contracts');

if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

export default function handler(req, res) {
  const form = formidable({
    keepExtensions: true,
    filename: (name, ext, part) => part.originalFilename, 
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing the files', err);
      return res.status(500).json({ error: 'Error parsing the files' });
    }

    const employeeNumber = Array.isArray(fields.EmployeeNumber) ? fields.EmployeeNumber[0] : fields.EmployeeNumber;

    if (!employeeNumber) {
      console.error('EmployeeNumber is missing');
      return res.status(400).json({ error: 'EmployeeNumber is missing' });
    }

    const employeeUploadDir = path.join(baseUploadDir, employeeNumber);

    if (!fs.existsSync(employeeUploadDir)) {
      fs.mkdirSync(employeeUploadDir, { recursive: true });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const oldPath = file.filepath;
    const newPath = path.join(employeeUploadDir, file.newFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('Error moving the file', err);
        return res.status(500).json({ error: 'Error moving the file' });
      }

      res.status(200).json({ message: 'Files uploaded successfully', files });
    });
  });
}