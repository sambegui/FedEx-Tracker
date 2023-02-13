/** 
 * This version of FedEx Tracker checks latest tracking status for tracking numbers
 * AUTHOR: Samuel Beguiristain
 * Version: 5
**/
function trackPackages() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FedEx Tracker");
  var range = sheet.getRange("A2:A" + sheet.getLastRow()).getValues();
  var trackingNumbers = range.flat();
  var trackingDetails = [];

  // Validate the range contains at least one non-empty cell
  if (trackingNumbers.length === 0 || trackingNumbers.every(function(row) { return row === "" })) {
    throw new Error("No tracking numbers found in range A2:A.");
  }

  var accessToken = getFedExAccessToken();

  var url = "https://apis.fedex.com/track/v1/trackingnumbers";
  var headers = {
    "Authorization": "Bearer " + accessToken,
    "Content-Type": "application/json"
  };

  for (var i = 0; i < trackingNumbers.length; i++) {
    var trackingNumber = trackingNumbers[i];
    if (!trackingNumber) {
      continue; // skip loop if current cell is blank
    }
    var payload = {
      "trackingInfo": [
        {
          "trackingNumberInfo": {
            "trackingNumber": trackingNumber
          }
        }
      ],
      "includeDetailedScans": false
    };
    var options = {
      "method": "POST",
      "headers": headers,
      "payload": JSON.stringify(payload)
    };
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());

    // Check if the tracking data is available
    if (json.alerts === "TRACKING.DATA.NOTFOUND -  Tracking data unavailable") {
      trackingDetails.push(["Tracking data unavailable"]);
    } else {
      var latestStatusDetail = json["output"]["completeTrackResults"][0]["trackResults"][0]["latestStatusDetail"];
      var description = latestStatusDetail.description;
      trackingDetails.push([description]);
    }
  }

  // Check if trackingDetails is empty
  if (trackingDetails.length === 0) {
    sheet.getRange("B2").setValue("Tracking data unavailable");
  } else {
    sheet.getRange(1, 1).setValue("Tracking"); // set the header for column A
    sheet.getRange(1, 2).setValue("Status"); // set the header for column B
    sheet.getRange(2, 2, trackingDetails.length, 1).setValues(trackingDetails);
  }

  // Output the tracking numbers and details to the console for sanity check
  console.log("Tracking Numbers:");
  console.log(trackingNumbers);
  console.log("Tracking Details:");
  console.log(trackingDetails);

  // Append the API response to the Logs sheet
  var logsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logs");
  logsSheet.appendRow([new Date(), "API Response", JSON.stringify(json)]);
}


function getFedExAccessToken() {
  var clientId = "api_key"; // Go to FedEx Developer Portal to get this
  var clientSecret = "secret_key"; // Go to FedEx Developer Portal to get this
  var grantType = "client_credentials"; // Use lower level grant type
  var tokenUrl = "https://apis.fedex.com/oauth/token";
  
  var payload = {
    "grant_type": grantType,
    "client_id": clientId,
    "client_secret": clientSecret,
    "scope": "openid"
  };
  
  var options = {
    "method": "POST",
    "muteHttpExceptions": true,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "payload": payload
  };
  
  var response = UrlFetchApp.fetch(tokenUrl, options);
  var responseCode = response.getResponseCode();
  var responseBody = response.getContentText();
  var logsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logs");
  //logsSheet.appendRow([new Date(), "Response code: " + responseCode, "Response body: " + responseBody]);

  if (responseCode === 200) {
    var tokenData = JSON.parse(responseBody);
    var accessToken = tokenData.access_token;
    return accessToken;
  } else {
    throw new Error("Failed to obtain FedEx access token. Response code: " + responseCode + ". Response body: " + responseBody);
  }
}

function getCarrierCode(trackingNumber) {
  var firstTwo = trackingNumber.toString().slice(0, 2);
  switch (firstTwo) {
    case "96":
      return "FHD";
    case "92":
    case "93":
    case "94":
    case "95":
      return "FDXE";
    default:
      return "FXG";
  }
}
