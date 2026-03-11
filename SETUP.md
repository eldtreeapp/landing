# Eldtree Landing — Waitlist Setup

## Google Sheets + Apps Script (free, unlimited)

### Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Name it **"Eldtree Waitlist"**
3. In row 1, add these headers:
   - A1: `timestamp`
   - B1: `email`

### Step 2: Add the Apps Script

1. In the spreadsheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var email = e.parameter.email;

  // Check for duplicate
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "duplicate" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  sheet.appendRow([new Date().toISOString(), email]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Save (Ctrl+S)

### Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon → select **Web app**
3. Set:
   - **Description**: Eldtree Waitlist
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Authorize the app when prompted
6. Copy the **Web App URL**

### Step 4: Update the landing page

Open `js/main.js` and replace `REPLACE_WITH_YOUR_APPS_SCRIPT_URL` with your Web App URL.

### Hosting

The landing page is fully static. Host it anywhere:

- **GitHub Pages**: push to a repo, enable Pages in settings
- **Cloudflare Pages**: connect the repo, build command = empty, output dir = `/`
- **Netlify**: drag and drop the `landing/` folder
- **Any static host**: just upload the files

### Testing locally

```bash
cd landing
python3 -m http.server 8000
# Open http://localhost:8000
```
