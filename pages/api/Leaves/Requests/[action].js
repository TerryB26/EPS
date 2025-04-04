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
          employeeID = '17e507f3-9311-4149-ae0b-fea95573bf13',
          leaveStatus: statusID,
          numberOfDays: leaveDuration,
          fromDate,
          tillDate,
          leaveType: requestTypeID,
          reason,
        } = normalizedFields;

        const leaveRequestID = uuidv4();

        await query(
          `INSERT INTO public.leaverequests (leaverequestid, employeeid, statusid, leaveduration, fromdate, tilldate, createdon, requesttypeid, updatedon)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW())`,
          [leaveRequestID, employeeID, statusID, leaveDuration, fromDate, tillDate, requestTypeID]
        );

        if (reason) {
          await query(
            `INSERT INTO public.leavereasons (leavereasonid, leaverequestid, employeereason, createdon, updatedon)
             VALUES ($1, $2, $3, NOW(), NOW())`,
            [uuidv4(), leaveRequestID, reason]
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
                `INSERT INTO public.leaveattatchments (leaveattatchmentid, leaverequestid, filename, createdon, updatedon)
                 VALUES ($1, $2, $3, NOW(), NOW())`,
                [attachmentID, leaveRequestID, fileName]
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

      case 'update-request':
        // Logic for updating a request (not implemented yet)
        break;

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