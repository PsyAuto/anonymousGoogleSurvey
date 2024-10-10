// Global variables
var spreadsheetId = 'spreadsheetID'; // Replace with your spreadsheet ID

function doGet(e) {
    var htmlTemplate = HtmlService.createTemplateFromFile('index.html');
    htmlTemplate.dataFromServerTemplate = { first: generateUniqueToken() };
    var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle('anonymous form landing page'); // Replace with the title of your research etc.
    return htmlOutput;
}

function generateToken() {
  return Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
}

function isDuplicateToken(token) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Sheet1');
  var lastRow = sheet.getLastRow();

  // Check if there are existing tokens in the sheet
  if (lastRow > 0) {
    var existingTokens = sheet.getRange(1, 1, lastRow, 1).getValues().flat();
    return existingTokens.includes(token.toString());
  } else {
    // If there are no existing tokens, return false
    return false;
  }
}

function generateUniqueToken(){
  // Check for duplicate tokens
  token = generateToken();
  while (isDuplicateToken(token)) {
    token = generateToken();
  }
  return token;
}

function saveToSpreadsheet(response) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Sheet1');
  var lastRow = sheet.getLastRow();

  // Get the form response data
  var itemResponses = response.getItemResponses();

  // Find the item response with the title "Your unique token is"
  var tokenItemResponse = itemResponses.find(function(itemResponse) {
    return itemResponse.getItem().getTitle() === "Your unique token is:"; //The field title that asks for the unique token - replace if changed in forms 
  });

  // Save the token value to the spreadsheet if found
  if (tokenItemResponse) {
    var tokenValue = tokenItemResponse.getResponse();
    sheet.getRange(lastRow + 1, 1).setValue(tokenValue);
  }
}

function onFormSubmit(e) {
  var response = e.response;
  saveToSpreadsheet(response);
}
