/**
 * DocClinic website: the registration form writes here (one row per doctor in this Google Sheet).
 *
 * Setup (once):
 *   1. Make a new Google Sheet.  Extensions -> Apps Script.  Delete what is there and paste this file.
 *   2. Change SECRET below to a word only you know (it protects the JSON list of registrations).
 *   3. Deploy -> New deployment -> type "Web app" -> Execute as: Me -> Who has access: Anyone -> Deploy.
 *      Allow the permissions it asks for. Copy the "Web app URL" (it ends with /exec) and put it in the website.
 *   4. The registrations: the sheet "Registrations".  As JSON:  <Web app URL>?key=<SECRET>
 * After you change this code: Deploy -> Manage deployments -> edit (pencil) -> Version: New version -> Deploy (the URL stays the same).
 */
const SECRET = 'change-me';
const SHEET = 'Registrations';
const FIELDS = ['name', 'specialty', 'phone', 'email', 'city', 'patients', 'current', 'lang'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(['time'].concat(FIELDS));
    sh.setFrozenRows(1);
  }
  return sh;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// The website sends the form here (POST, JSON text).
function doPost(e) {
  let d = {};
  try { d = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { d = (e && e.parameter) || {}; }
  if (d.website) return out_({ status: 'ok' });                       // the hidden field: filled only by spam robots
  const clean = v => String(v == null ? '' : v).replace(/^[=+\-@]+/, '').slice(0, 200);   // no spreadsheet formulas
  if (!clean(d.name).trim() || !/^\+?\d{8,15}$/.test(clean(d.phone))) return out_({ status: 'error' });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // every answer as text: a leading ' stops Sheets from turning 01012345678 into a number or 10-20 into a date
    sheet_().appendRow([new Date()].concat(FIELDS.map(f => { const v = clean(d[f]); return v ? "'" + v : ''; })));
  } finally {
    lock.releaseLock();
  }
  return out_({ status: 'ok' });
}

// The JSON list of registrations, for you only:  <Web app URL>?key=<SECRET>
function doGet(e) {
  if (!e || !e.parameter || e.parameter.key !== SECRET || SECRET === 'change-me') return out_({ status: 'error', error: 'key' });
  const rows = sheet_().getDataRange().getValues();
  const head = rows.shift();
  return out_({ status: 'ok', count: rows.length, registrations: rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i]]))) });
}
