import { query } from '@/library/database';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};

  try {
    switch (action) {
      case 'new-request': {
        const { fields, files } = await parseForm(req);
        const normalizedFields = Object.fromEntries(
          Object.entries(fields).map(([key, value]) => [key, value[0]])
        );

        const {
          leaveStatus: statusID,
          numberOfDays: leaveDuration,
          fromDate,
          tillDate,
          leaveType: requestTypeID,
          reason,
          user: userString,
        } = normalizedFields;
        const user = JSON.parse(userString);        
        const employeeID = user.employeeid;


        const leaveRequestID = uuidv4();

        await query(
          `INSERT INTO public.leaverequests (leaverequestid, employeeid, statusid, leaveduration, fromdate, tilldate, createdon, requesttypeid, updatedon, createdby, updatedby)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW(), $8, $9)`,
          [leaveRequestID, employeeID, statusID, leaveDuration, fromDate, tillDate, requestTypeID, user.userid, user.userid]
        );

        if (reason) {
          await query(
            `INSERT INTO public.leavereasons (leavereasonid, leaverequestid, employeereason, createdon, updatedon, createdby, updatedby)
             VALUES ($1, $2, $3, NOW(), NOW(), $4, $5)`,
            [uuidv4(), leaveRequestID, reason, user.userid, user.userid]
          );
        }

        if (files.file && files.file[0]?.filepath) {
          const file = files.file[0]; 
        
          const attachmentID = uuidv4();
          const saveDir = path.join(process.cwd(), 'EmployeeFiles', 'LeaveDocs', leaveRequestID);
          const fileName = file.originalFilename || 'unknown_file';
          const filePath = path.join(saveDir, fileName);
        
          if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
          }
        

          if (fs.existsSync(file.filepath)) {
            try {
              fs.renameSync(file.filepath, filePath);
              await query(
                `INSERT INTO public.leaveattatchments (leaveattatchmentid, leaverequestid, filename, createdon, updatedon, createdby, updatedby)
                 VALUES ($1, $2, $3, NOW(), NOW(), $4, $5)`,
                [attachmentID, leaveRequestID, fileName, user.userid, user.userid]
              );
            } catch (err) {
              console.error("Error moving file:", err);
              throw new Error("Failed to save file.");
            }
          } else {
            console.error("File does not exist at the source path:", file.filepath);
            throw new Error("Source file not found.");
          }
        } else {
          console.log("No file uploaded or file path is undefined.");
        }

        response = { message: 'Leave request created successfully', leaveRequestID };
        break;
      }

      case 'update-request': {
        let body;
      
        if (req.headers['content-type'] === 'application/json') {
          body = await new Promise((resolve, reject) => {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              try {
                resolve(JSON.parse(data));
              } catch (err) {
                reject(err);
              }
            });
          });
        } else {
          body = req.body; 
        }
      
        const { requestID, leaveStatus, reason, user } = body;
            
        await query(
          `UPDATE public.leaverequests
           SET statusid = $1, updatedon = NOW(), updatedby = $3
           WHERE leaverequestid = $2`,
          [leaveStatus, requestID, user.userid]
        );
      
        if (reason) {
          await query(
            `UPDATE public.leavereasons
             SET leaveresponse = $1, updatedon = NOW()
             WHERE leaverequestid = $2`,
            [reason, requestID]
          );
        }
      
        response = { message: 'Leave request updated successfully' };
        break;
      }

        case 'download-attatchment': {
          let body;
        
          if (req.headers['content-type'] === 'application/json') {
            body = await new Promise((resolve, reject) => {
              let data = '';
              req.on('data', (chunk) => {
                data += chunk;
              });
              req.on('end', () => {
                try {
                  resolve(JSON.parse(data));
                } catch (err) {
                  reject(err);
                }
              });
            });
          } else {
            body = req.body; 
          }
        
          const { leaverequestid, attachment_filename, employeenumber } = body;
        
          if (!leaverequestid || !attachment_filename || !employeenumber) {
            status = 400;
            response = { error: 'Missing required parameters' };
            break;
          }
        
          const filePath = path.join(process.cwd(), 'EmployeeFiles', 'LeaveDocs', leaverequestid, attachment_filename);
        
          if (!fs.existsSync(filePath)) {
            status = 404;
            response = { error: 'File not found' };
            break;
          }
        
          try {
            const fileStream = fs.createReadStream(filePath);
            res.setHeader('Content-Disposition', `attachment; filename="${attachment_filename}"`);
            res.setHeader('Content-Type', 'application/octet-stream');
            fileStream.pipe(res);
            return; 
          } catch (error) {
            console.error('Error downloading the file:', error);
            status = 500;
            response = { error: 'Failed to download the file' };
          }
          break;
        }

      default:
        status = 400;
        response = { error: 'Invalid action' };
    }
  } catch (error) {
    status = 500;
    response = { error: error.message || 'Internal Server Error' };
    console.error('API Error:', error);
  }

  res.status(status).json(response);
}