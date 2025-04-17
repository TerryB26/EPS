import path from 'path';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { month,year,takeHomePayDetails,User, Type } = req.body;
  console.log("🚀 ~ handler ~ req.body:", req.body)

  try {
    const templatePath = path.resolve(process.cwd(), 'public/Templates', 'Payslip1.docx');
    console.log("🚀 ~ handler ~ templatePath:", templatePath)
    const content = fs.readFileSync(templatePath, 'binary');

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.render({
        EmpNetSal: takeHomePayDetails.takeHomePay,
        TotalDeductions:  takeHomePayDetails.paye + takeHomePayDetails.uif,
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


    let fileBuffer = doc.getZip().generate({ type: 'nodebuffer' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${User.name}_report.docx"`);
      res.send(fileBuffer);

  } catch (error) {
    console.error("Error generating the document:", error);
    res.status(500).json({ error: error.message });
  }
}