const XLSX = require('xlsx');
const path = 'C:/Users/SAIF/Desktop/LISTE FOURNISSEUR B2B.xlsx';
try {
  const workbook = XLSX.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  console.log(JSON.stringify(data, null, 2));
} catch (e) {
  console.error(e);
}
