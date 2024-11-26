const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");

let mainWindow = null;//主窗口变量
let updateResultWindow = null;//更新结果窗口变量

//创建主窗口函数
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.loadFile("./windows/mainWindow/mainWindow.html");
};

//创建更新结果窗口函数
function createUpdateResultWindow() {
    updateResultWindow = new BrowserWindow({
        width: 300,
        height: 150,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    updateResultWindow.loadFile("./windows/updateResultWindow/updateResultWindow.html");
};

//检查更新函数
async function checkForUpdates() {
    autoUpdater.on("update-available", (info) => {
        createUpdateResultWindow();
        updateResultWindow.webContents.send("update-available", info);
        autoUpdater.downloadUpdate();
    });

    autoUpdater.on("error", (error) => {
        createUpdateResultWindow();
        updateResultWindow.webContents.send("error", error);
    });

    autoUpdater.on("update-downloaded", (info) => {
        autoUpdater.quitAndInstall(false, true);
    })

    autoUpdater.on("download-progress", (progressObj) => {
        updateResultWindow.webContents.send("download-progress", progressObj);
    })

    const updateResult = await autoUpdater.checkForUpdates();
};

//启动应用
app.on("ready", () => {
    checkForUpdates();//检查更新
    createMainWindow();//创建主窗口
});

app.on("window-all-closed", () => {
    app.quit();
})