import path from 'path';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { month, year, takeHomePayDetails, User } = req.body;
  console.log("🚀 ~ handler ~ req.body:", req.body);

  try {
    const templatePath = path.resolve(process.cwd(), 'public/Templates', 'Payslip1.docx');
    console.log("🚀 ~ handler ~ templatePath:", templatePath);
    const content = fs.readFileSync(templatePath, 'binary');

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.render({
      EmpNetSal: takeHomePayDetails.takeHomePay,
      TotalDeductions: takeHomePayDetails.paye + takeHomePayDetails.uif,
      CompMedicalAid: 0,
      GrossSalary: takeHomePayDetails.grossSalary,
      EmpTaxAmount: takeHomePayDetails.paye,
      GrossSalary: takeHomePayDetails.grossSalary,
      BonusSalary: 0,
      OvertimePay: 0,
      EMPDepartment: `${User.departmentname}`,
      EMPJobTitle: `${User.jobtitlename}`,
      EMPNumber: User.employeenumber,
      EMPNameSurname: `${User.name} ${User.surname}`,
      PayslipDate: `${month} ${year}`,
    });

    const fileBuffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Use the Node.js FormData package
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: `${User.name}_report.docx`,
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });


    const response = await axios.post('http://185.220.204.117:2606/Flexify/api/PDFConverter/', formData, {
      headers: formData.getHeaders(), // Use the correct headers from the Node.js FormData
      responseType: 'arraybuffer',
    });

    if (response.status === 200) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${User.name}_report.pdf"`);
      res.send(response.data);
    } else {
      console.error("Failed to convert document to PDF:", response.statusText);
      res.status(500).json({ error: "Failed to convert document to PDF" });
    }
  } catch (error) {
    console.error("Error generating the document:", error);
    res.status(500).json({ error: error.message });
  }
}