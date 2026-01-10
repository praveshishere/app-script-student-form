/**
 * Handles the GET request
 */
function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Student Management System")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Includes the file
 *
 * @param {string} filename
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

const SpreadSheetName = "StudentsDB";
const StudentSheetName = "Students";

/**
 * Gets or creates a spread sheet
 *
 * @param {string} spreadSheetName
 */
function getOrCreateSpreadSheet(spreadSheetName) {
  const props = PropertiesService.getUserProperties();

  let sheetId = props.getProperty("SHEET_ID");

  if (!sheetId) {
    const ss = SpreadsheetApp.create(spreadSheetName);
    sheetId = ss.getId();
    props.setProperty("SHEET_ID", sheetId);
  }

  return SpreadsheetApp.openById(sheetId);
}

/**
 * Gets or creates a sheet in the spread sheet
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @param {string} sheetName
 */
function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  return sheet;
}

/**
 * Prepares the sheet by adding the header row if it doesn't exist
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 */
function prepareSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Student ID",
      "First Name",
      "Last Name",
      "Email",
      "Course",
      "DOB",
    ]);
  }
}

/**
 * Gets the student sheet
 */
function getStudentSheet() {
  const spreadSheet = getOrCreateSpreadSheet(SpreadSheetName);

  const sheet = getOrCreateSheet(spreadSheet, StudentSheetName);

  prepareSheet(sheet);

  return sheet;
}

/**
 * Gets the row by record id
 *
 * @param {string} recordId
 * @param {number} columnNumber
 */
function getRowByRecordId(recordId, columnNumber) {
  const sheet = getStudentSheet();

  const match = sheet
    .getRange(2, columnNumber, sheet.getLastRow() - 1)
    .createTextFinder(String(recordId))
    .matchEntireCell(true)
    .findNext();

  return match ? match.getRow() : null;
}

/**
 * Updates an existing student in record
 *
 * @param {{
 *   studentId: string,
 *   firstName: string,
 *   lastName: string,
 *   email: string,
 *   course: string,
 *   dob: string
 * }} studentData
 */
function updateStudent(studentData) {
  const sheet = getStudentSheet();

  const studentRow = getRowByRecordId(studentData.studentId, 1);

  const dataToWrite = [
    studentData.studentId,
    studentData.firstName,
    studentData.lastName,
    studentData.email,
    studentData.course,
    studentData.dob,
  ];

  sheet.getRange(studentRow, 1, 1, dataToWrite.length).setValues([dataToWrite]);

  return { success: true };
}

/**
 * Adds a new student to the record
 *
 * @param {{
 *   studentId: string,
 *   firstName: string,
 *   lastName: string,
 *   email: string,
 *   course: string,
 *   dob: string
 * }} studentData
 */
function addStudent(studentData) {
  const sheet = getStudentSheet();

  const studentId = Utilities.getUuid().split("-")[0].toUpperCase();

  sheet.appendRow([
    studentId,
    studentData.firstName,
    studentData.lastName,
    studentData.email,
    studentData.course,
    studentData.dob,
  ]);

  return { success: true };
}

/**
 * Deletes a student from the record
 *
 * @param {string} studentId
 */
function deleteStudent(studentId) {
  const sheet = getStudentSheet();

  const studentRow = getRowByRecordId(studentId, 1);

  sheet.deleteRow(studentRow);

  return { success: true };
}

/**
 * Gets all students from the record as JSON string
 *
 */
function getStudents() {
  const sheet = getStudentSheet();

  const lastColumn = sheet.getLastColumn();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return JSON.stringify([]);

  const range = sheet.getRange(2, 1, lastRow - 1, lastColumn);

  const values = range.getValues();

  const students = values.map((value) => {
    return {
      studentId: value[0],
      firstName: value[1],
      lastName: value[2],
      email: value[3],
      course: value[4],
      dob: value[5],
    };
  });

  return JSON.stringify(students);
}

/**
 * Test Function
 */
function main() {
  const students = getStudents();
  console.log(students, "students");
}
