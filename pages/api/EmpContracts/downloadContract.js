import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { employeeNumber, contractName } = req.body;

    if (!employeeNumber || !contractName) {
      return res.status(400).json({ error: 'Missing employeeNumber or contractName' });
    }

    // Construct the file path including the contractName
    const filePath = path.join(
      process.cwd(),
      'EmployeeFiles',
      'Contracts',
      employeeNumber,
      contractName // Include the contractName in the path
    );
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set headers and send the file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${contractName}`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}