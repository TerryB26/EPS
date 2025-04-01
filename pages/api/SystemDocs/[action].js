import fs from 'fs';
import path from 'path';
console.log("🚀 ~ handler ~ DocUUID:", "DocUUID")

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing since we're handling multipart/form-data
  },
};

import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/library/database';

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};

  const baseUploadDir = path.join(process.cwd(), 'public/systemdocs');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: true,
    uploadDir: baseUploadDir,
    keepExtensions: true,
    filename: (name, ext, part, form) => {
      return part.originalFilename;
    },
  });

  try {
    switch (action) {
      case 'add-doc':
        if (method === 'POST') {
          const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) reject(err);
              resolve({ fields, files });
            });
          });

          const documentTitle = fields.documentTitle[0];
          const documentType = fields.documentType[0];
          const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];

          const insertDocQuery = `
            INSERT INTO public."systemdocs" (
              "documentuuid", 
              "documentname", 
              "documenttitle", 
              "documenttype", 
              "createdon", 
              "updatedon"
            )
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            RETURNING *;
          `;

          const results = [];
          for (const file of uploadedFiles) {
            const documentUuid = uuidv4();
            const originalFileName = file.originalFilename;
            const uuidDir = path.join(baseUploadDir, documentUuid);

            if (!fs.existsSync(uuidDir)) {
              fs.mkdirSync(uuidDir, { recursive: true });
            }

            const newFilePath = path.join(uuidDir, originalFileName);
            fs.renameSync(file.filepath, newFilePath);

            const result = await query(insertDocQuery, [
              documentUuid,
              originalFileName,
              documentTitle,
              documentType,
            ]);
            results.push(result.rows[0]);
          }

          response = { 
            message: 'Documents added successfully', 
            documents: results 
          };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'edit-doc':
        if (method === 'POST') {
          const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) reject(err);
              resolve({ fields, files });
            });
          });

          const documentID = fields.documentID[0];
          const documentTitle = fields.documentTitle[0];
          const documentType = fields.documentType[0];
          const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];

          const fetchOldDocsQuery = `
            SELECT "documentuuid", "documentname" 
            FROM public."systemdocs" 
            WHERE "documentuuid" = $1;
          `;
          const oldDocs = await query(fetchOldDocsQuery, [documentID]);
          for (const doc of oldDocs.rows) {
            const oldFilePath = path.join(baseUploadDir, doc.documentuuid, doc.documentname);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath); // Delete old file
            }
            const oldDir = path.join(baseUploadDir, doc.documentuuid);
            if (fs.existsSync(oldDir) && fs.readdirSync(oldDir).length === 0) {
              fs.rmdirSync(oldDir); // Remove empty directory
            }
          }

          const deleteQuery = `
            DELETE FROM public."systemdocs" 
            WHERE "documentuuid" = $1;
          `;
          await query(deleteQuery, [documentID]);

          const insertDocQuery = `
            INSERT INTO public."systemdocs" (
              "documentuuid", 
              "documentname", 
              "documenttitle", 
              "documenttype", 
              "createdon", 
              "updatedon"
            )
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            RETURNING *;
          `;

          const results = [];
          for (const file of uploadedFiles) {
            const documentUuid = uuidv4();
            const originalFileName = file.originalFilename;
            const uuidDir = path.join(baseUploadDir, documentUuid);

            if (!fs.existsSync(uuidDir)) {
              fs.mkdirSync(uuidDir, { recursive: true });
            }

            const newFilePath = path.join(uuidDir, originalFileName);
            fs.renameSync(file.filepath, newFilePath);

            const result = await query(insertDocQuery, [
              documentUuid,
              originalFileName,
              documentTitle,
              documentType,
            ]);
            results.push(result.rows[0]);
          }

          response = { 
            message: 'Documents updated successfully', 
            documents: results 
          };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'Download-doc':
        if (method === 'GET') {
          const { documentuuid, documentname } = req.query;

          if (!documentuuid || !documentname) {
            status = 400;
            response = { error: 'Both document UUID and name are required' };
          } else {
            const filePath = path.join(baseUploadDir, documentuuid, documentname);

            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Disposition', `attachment; filename="${documentname}"`);
              res.setHeader('Content-Type', 'application/octet-stream');
              
              const fileStream = fs.createReadStream(filePath);
              fileStream.pipe(res);
              return;
            } else {
              status = 404;
              response = { error: 'File not found on server' };
            }
          }
        } else {
          res.setHeader('Allow', ['GET']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

        case 'delete-doc':          
            if (method === 'DELETE') {
              try {
                const buffers = [];
                for await (const chunk of req) {
                  buffers.push(chunk);
                }
                const body = JSON.parse(Buffer.concat(buffers).toString());
                const { DocUUID } = body;
                    
                if (!DocUUID) {
                  status = 400;
                  response = { error: 'Document UUID is required' };
                } else {
                  const deleteQuery = `
                    DELETE FROM public."systemdocs" 
                    WHERE "documentuuid" = $1 
                    RETURNING *;
                  `;          
                  const result = await query(deleteQuery, [DocUUID]);          
                  if (result.rows.length === 0) {
                    status = 404;
                    response = { error: 'Document not found' };
                  } else {
                    response = { message: 'Document record deleted successfully' };
                  }
                }
              } catch (error) {
                status = 500;
                response = { error: 'Failed to process the request' };
              }
            } else {
              res.setHeader('Allow', ['DELETE']);
              status = 405;
              response = { error: `Method ${method} Not Allowed` };
            }
            break;

      default:
        status = 400;
        response = { error: 'Invalid action' };
        break;
    }
  } catch (error) {
    status = 500;
    response = { error: error.message || 'Internal Server Error' };
  }

  res.status(status).json(response);
}