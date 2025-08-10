# Web Bus Pirate Console

This is a web-based console for the Bus Pirate, implemented using the WebSerial API. It is a modern, browser-based alternative to the original C# application.

## How to Run

1.  Clone this repository to your local machine.
2.  Open the `index.html` file in a web browser that supports the WebSerial API (e.g., Google Chrome, Microsoft Edge).
3.  You do not need to run a local web server. You can open the `index.html` file directly from your file system.

## How to Use

1.  Click the "Connect" button. This will open a dialog where you can select the serial port connected to your Bus Pirate.
2.  Once connected, the status will change to "Connected", and you can start sending commands to the Bus Pirate.
3.  You can use the terminal to send commands directly, or use the controls in the different mode tabs.

## Browser Compatibility

This application relies on the WebSerial API, which is a relatively new technology. As of now, it is supported in the following browsers:

*   Google Chrome (version 78 and later)
*   Microsoft Edge (version 78 and later)
*   Opera (version 65 and later)

Please make sure you are using a compatible browser.
