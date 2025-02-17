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
    return genderDigit < 5 ? 'Female' : 'Male';
  };