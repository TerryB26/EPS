export const getDateOfBirthFromID = (idNumber) => {
  const idRegex = /^(\d{2})(\d{2})(\d{2})\d{7}$/;
  if (!idRegex.test(idNumber)) {
    throw new Error("Invalid ID number format");
  }

  const [, year, month, day] = idNumber.match(idRegex);
  const currentYear = new Date().getFullYear();
  const fullYear = year > currentYear % 100 ? `19${year}` : `20${year}`;

  return new Date(`${fullYear}-${month}-${day}`);
};

export const validateIDNumber = (idNumber) => {
  const idRegex = /^(\d{2})(\d{2})(\d{2})\d{7}$/;
  return idRegex.test(idNumber);
};

export const getGenderFromID = (idNumber) => {
  const genderDigit = parseInt(idNumber.charAt(6), 10);
  return genderDigit < 5 ? "Female" : "Male";
};

export const generateEmployeeNumber = (idNumber) => {
  const idRegex = /^\d{3}(\d{4})\d{6}$/;
  if (!idRegex.test(idNumber)) {
    throw new Error("Invalid ID number format");
  }

  const [, idSegment] = idNumber.match(idRegex);
  const randomDigits = Math.floor(100 + Math.random() * 900);

  return `EMP-${idSegment}-${randomDigits}`;
};

export const calculateTakeHomePay = (idNumber, monthlySalary) => {
  if (!validateIDNumber(idNumber)) {
    throw new Error("Invalid ID number format");
  }
  // if (typeof monthlySalary !== "number" || monthlySalary <= 0) {
  //   throw new Error("Salary must be a positive number");
  // }

  const dob = getDateOfBirthFromID(idNumber);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  const annualSalary = monthlySalary * 12;

  let annualTaxBeforeRebate = 0;
  if (annualSalary <= 226000) {
    annualTaxBeforeRebate = annualSalary * 0.18;
  } else if (annualSalary <= 353100) {
    annualTaxBeforeRebate = 40680 + (annualSalary - 226000) * 0.26;
  } else {
    annualTaxBeforeRebate =
      40680 + 127100 * 0.26 + (annualSalary - 353100) * 0.31;
  }

  let rebate = 0;
  if (age < 65) {
    rebate = 17235;
  } else if (age >= 65 && age < 75) {
    rebate = 17235 + 9444;
  } else if (age >= 75) {
    rebate = 17235 + 10935;
  }

  const annualTaxPayable = Math.max(0, annualTaxBeforeRebate - rebate);
  const monthlyPAYE = annualTaxPayable / 12;

  const uifCap = 17712;
  const uifContribution = Math.min(monthlySalary, uifCap) * 0.01;

  const takeHomePay = monthlySalary - monthlyPAYE - uifContribution;

  return {
    grossSalary: monthlySalary,
    paye: parseFloat(monthlyPAYE.toFixed(2)),
    uif: parseFloat(uifContribution.toFixed(2)),
    takeHomePay: parseFloat(takeHomePay.toFixed(2)),
    age: age,
  };
};

export const isEligibleForBonus = (startDate) => {
  const currentDate = new Date();
  const start = new Date(startDate);

  const monthsWithCompany = (currentDate.getFullYear() - start.getFullYear()) * 12 + (currentDate.getMonth() - start.getMonth());

  const isDecember = currentDate.getMonth() === 11; 
  const eligible = monthsWithCompany >= 8 && isDecember;

  return eligible;
};


