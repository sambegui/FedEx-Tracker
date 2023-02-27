# FedEx Tracker
This is a Google Apps Script that checks the latest tracking status for tracking numbers using the FedEx API. The tracking numbers are stored in a Google Sheet, and the script retrieves the tracking details for each number and writes the results to the sheet.

## Usage
To use this script:

Open the Google Sheet where you want to track FedEx packages.
Click on Tools and then Script editor.
Copy and paste the code from this repository into the editor.
Save the script with a name of your choice.
Modify the clientId and clientSecret variables in the getFedExAccessToken function with your own values. You can obtain these values from the FedEx Developer Portal.
Modify the sheetName variable in the trackPackages function with the name of the sheet that contains your tracking numbers.
Run the trackPackages function by clicking on the play button or by going to Run > trackPackages.
The script will retrieve the tracking details for each number and write the results to the sheet.
You can also set up a trigger to run the script automatically by calling the setRefreshTriggerFedEx function. This will create a time-based trigger that runs the script every 12 hours.

## Credits
This script was created by Samuel Beguiristain.
