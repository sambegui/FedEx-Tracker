# FedEx Sheet Tracker
This is a Google Apps Script that checks the latest tracking status for tracking numbers using the FedEx API. The tracking numbers are stored in a Google Sheet, and the script retrieves the tracking details for each number and writes the results to the sheet.

## Sheet Requirments
This script assumes that you have a Google Sheet with the following requirements:

1. A sheet named "FedEx Tracker" exists in the Google Sheet.
2. The first column of the "FedEx Tracker" sheet contains the tracking numbers.
3. The second column of the "FedEx Tracker" sheet contains the tracking status, which can be either "In Transit", "Delivered", or empty.
4. A sheet named "Logs" exists in the Google Sheet to store the API responses and delivered count.
Make sure that your Google Sheet meets these requirements before running the script.

## Usage
To use this script:

1. Open the Google Sheet where you want to track FedEx packages.
2. Click on `Tools` and then `Script editor`.
3. Copy and paste the code from this repository into the editor.
4. Save the script with a name of your choice.
5. Modify the `clientId` and `clientSecret` variables in the `getFedExAccessToken` function with your own values. You can obtain these values from the [FedEx Developer Portal](https://www.fedex.com/en-us/developer.html).
6. Modify the `sheetName` variable in the `trackPackages` function with the name of the sheet that contains your tracking numbers.
7. Run the `trackPackages` function by clicking on the play button or by going to `Run` > trackPackages. Or by creating a macro from `Extensions` in your sheet.
8. The script will retrieve the tracking details for each number and write the results to the sheet.

You can also set up a trigger to run the script automatically by calling the `setRefreshTriggerFedEx` function. This will create a time-based trigger that runs the script every 12 hours.

## Example
![SCR-20230227-2og](https://user-images.githubusercontent.com/125210256/221495339-7ec38cfa-6b51-4711-b69a-e04329aa176d.png)

## Credits
This script was created by Samuel Beguiristain.
