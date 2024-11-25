const { app, BrowserWindow } = require("electron");

let windows = [];

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });
    mainWindow.loadFile("./windows/mainWindow/mainWindow.html");
};

app.on("ready", () => {
    createMainWindow();
});