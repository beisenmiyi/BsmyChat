const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");

let mainWindow = null;//主窗口变量
let updateResultWindow = null;//更新窗口变量

//检查更新函数
function checkForUpdates() {
    autoUpdater.autoDownload = false;//关闭自动下载

    //监听到“有可用更新”事件时
    autoUpdater.on("update-available", (info) => {
        createUpdateResultWindow();//创建更新窗口
        updateResultWindow.webContents.send("updateAvailable", info);//发送更新信息到更新窗口
    });

    //更新检测失败时
    autoUpdater.on("error", (error) => {
        createUpdateResultWindow();
        updateResultWindow.webContents.send("error", error);//发送错误信息到更新窗口
    });

    //下载完成时
    autoUpdater.on("update-downloaded", () => {
        updateResultWindow.webContents.send("updateDownloaded");//发送下载完成信息到更新窗口
    })

    //下载进度改变时
    autoUpdater.on("download-progress", (progressObj) => {
        updateResultWindow.webContents.send("downloadProgress", progressObj);//发送下载进度信息到更新窗口
    })

    //监听下载更新请求
    ipcMain.on("downloadUpdate", (event) => {
        autoUpdater.downloadUpdate();//下载更新
    })

    //监听安装更新请求
    ipcMain.on("quitAndInstall", (event) => {
        autoUpdater.quitAndInstall();//安装更新
    })

    autoUpdater.checkForUpdates();//检查更新
};

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

//创建更新窗口的函数
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

//启动应用
app.on("ready", () => {
    checkForUpdates();//检查更新
    createMainWindow();//创建主窗口
});

//当所有窗口都关闭时，退出软件
app.on("window-all-closed", () => {
    app.quit();
})