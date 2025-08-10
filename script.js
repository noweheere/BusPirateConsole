// script.js

// UI Logic for tabs
function openMode(evt, modeName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(modeName).style.display = "block";
    evt.currentTarget.className += " active";
}

// BPPort class for WebSerial communication
class BPPort {
    constructor() {
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }

    async connect() {
        try {
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: 115200 });

            this.writer = this.port.writable.getWriter();

            const reader = this.port.readable.getReader();
            this.reader = reader;

            document.getElementById('status').textContent = 'Connected';
            document.getElementById('connect-button').textContent = 'Disconnect';

            // Start reading from the port
            this.readLoop();

        } catch (error) {
            console.error('There was an error opening the serial port:', error);
            let errorMessage = `Error: ${error.message}`;
            if (error.name === 'NotFoundError') {
                errorMessage = "Connection cancelled: You must select a serial port from the dialog to connect to the Bus Pirate.";
            } else if (error.name === 'InvalidStateError') {
                errorMessage = "Connection failed: The port is already in use. Make sure no other application is connected to the Bus Pirate.";
            } else {
                errorMessage = `An unexpected error occurred: ${error.message}. If you are on Windows, you may need to install a driver for the Bus Pirate's serial chip (FTDI). You can find the latest drivers at <a href="https://ftdichip.com/drivers/vcp-drivers/" target="_blank">https://ftdichip.com/drivers/vcp-drivers/</a>.`;
            }
            document.getElementById('status').innerHTML = errorMessage;
        }
    }

    async disconnect() {
        if (this.reader) {
            await this.reader.cancel();
            this.reader.releaseLock();
            this.reader = null;
        }
        if (this.writer) {
            this.writer.releaseLock();
            this.writer = null;
        }
        if (this.port) {
            await this.port.close();
            this.port = null;
        }
        document.getElementById('status').textContent = 'Disconnected';
        document.getElementById('connect-button').textContent = 'Connect';
    }

    async write(data) {
        if (!this.writer) {
            console.error('Port not open');
            return;
        }
        await this.writer.write(this.encoder.encode(data + '\n'));
    }

    async readLoop() {
        const terminalWindow = document.getElementById('terminal-window');
        while (this.port && this.port.readable) {
            try {
                const { value, done } = await this.reader.read();
                if (done) {
                    // Reader has been canceled.
                    break;
                }
                const text = this.decoder.decode(value);
                terminalWindow.textContent += text;
                terminalWindow.scrollTop = terminalWindow.scrollHeight;
            } catch (error) {
                console.error('Read error:', error);
                terminalWindow.textContent += `\n---Read error: ${error.message}---\n`;
                break;
            }
        }
    }

    // ... methods for different commands will go here ...
    async sendCommand(command, expectedResponse) {
        // A more sophisticated write that waits for a response
        // For now, just a simple write
        await this.write(command);
    }

    async modeHiZ() {
        await this.sendCommand('m\n1');
    }

    async i2cScanner() {
        await this.sendCommand('(1)');
    }
}

// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connect-button');
    const sendButton = document.getElementById('send-button');
    const commandInput = document.getElementById('command-input');
    const i2cModeButton = document.getElementById('i2c-mode-button');
    const i2cScannerButton = document.getElementById('i2c-scanner-button');
    const spiModeButton = document.getElementById('spi-mode-button');
    const uartModeButton = document.getElementById('uart-mode-button');
    const oneWireModeButton = document.getElementById('1-wire-mode-button');
    const twoWireModeButton = document.getElementById('2-wire-mode-button');
    const threeWireModeButton = document.getElementById('3-wire-mode-button');

    let bpPort = new BPPort();

    connectButton.addEventListener('click', async () => {
        if (bpPort.port) {
            await bpPort.disconnect();
        } else {
            await bpPort.connect();
        }
    });

    sendButton.addEventListener('click', async () => {
        const command = commandInput.value;
        if (command) {
            await bpPort.write(command);
            commandInput.value = '';
        }
    });

    commandInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    i2cModeButton.addEventListener('click', async () => {
        await bpPort.write('m4');
    });

    i2cScannerButton.addEventListener('click', async () => {
        await bpPort.i2cScanner();
    });

    spiModeButton.addEventListener('click', async () => {
        await bpPort.write('m5');
    });

    uartModeButton.addEventListener('click', async () => {
        await bpPort.write('m3');
    });

    oneWireModeButton.addEventListener('click', async () => {
        await bpPort.write('m2');
    });

    twoWireModeButton.addEventListener('click', async () => {
        await bpPort.write('m6');
    });

    threeWireModeButton.addEventListener('click', async () => {
        await bpPort.write('m7');
    });
});
