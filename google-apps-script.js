// ================================================
// THE FINAL SHOWDOWN — Google Apps Script
// ================================================
// HOW TO SET UP (takes ~5 minutes):
//
// 1. Go to https://script.google.com
// 2. Click "New Project"
// 3. Delete all existing code and paste THIS entire file
// 4. Click the floppy disk icon (Save) — name it anything
// 5. Click "Deploy" → "New Deployment"
// 6. Click gear icon next to "Type" → Select "Web App"
// 7. Set:
//    - Description: TFS Registrations
//    - Execute as: Me
//    - Who has access: Anyone
// 8. Click "Deploy" — authorize when prompted
// 9. COPY the Web App URL shown
// 10. Paste that URL into script.js as the value of SHEET_URL
//
// Your Google Sheet will auto-create a "Registrations" sheet
// and every form submission will appear as a new row instantly.
// ================================================

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Registrations');

    // Create sheet + headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet('Registrations');
      sheet.appendRow([
        'Reg ID',
        'Timestamp',
        'Team Name',
        'Leader Name',
        'Email',
        'Phone',
        'College',
        'Team Size',
        'Year',
        'Events',
        'Notes'
      ]);

      // Style the header row
      const header = sheet.getRange(1, 1, 1, 11);
      header.setBackground('#1a1a2e');
      header.setFontColor('#00e5ff');
      header.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Parse incoming JSON
    const data = JSON.parse(e.postData.contents);

    // Append the registration row
    sheet.appendRow([
      data.regId        || '',
      data.timestamp    || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.teamName     || '',
      data.leaderName   || '',
      data.email        || '',
      data.phone        || '',
      data.college      || '',
      data.teamSize     || '',
      data.year         || '',
      data.events       || '',
      data.notes        || ''
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 11);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', regId: data.regId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — run this inside Apps Script to verify setup
function testSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Connected to spreadsheet: ' + ss.getName());
  Logger.log('Setup looks good! Deploy as Web App to start receiving registrations.');
}
