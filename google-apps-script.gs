/* =========================================================
   CONFIGURATION
   ⚠️ PLACEHOLDER: Paste your own Spreadsheet ID here.
   (It's the long text in the Sheet URL between /d/ and /edit)
   ========================================================= */
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const SHEET_NAME = "Contact Submissions";

/* =========================================================
   doPost(e) runs automatically whenever the website
   sends a POST request to this Web App URL.
   ========================================================= */
function doPost(e) {
  try {
    // 1. Read the values sent by the frontend (script.js)
    const data = e.parameter;
    const name = data.name;
    const email = data.email;
    const phone = data.phone;
    const subject = data.subject;
    const message = data.message;

    // 2. Basic server-side check
    if (!name || !email || !message) {
      throw new Error("Missing required fields");
    }

    // 3. Open the spreadsheet and find the sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // 4. Create the sheet + headers if they don't exist yet
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Subject", "Message"]);
      sheet.getRange("A1:F1").setFontWeight("bold");
    }

    // 5. Add a new row: timestamp + form data
    sheet.appendRow([new Date(), name, email, phone, subject, message]);

    // 6. Send a success response back to the website
    return jsonResponse({ success: true, message: "Form submitted successfully" });

  } catch (error) {
    // Log the real error (visible in Apps Script > Executions)
    console.error(error);
    return jsonResponse({ success: false, message: "Something went wrong" });
  }
}

/* Helper: build a JSON response */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
