const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");
const fs = require("fs");

let mainWindow = null;          //声明主窗口变量
let updateResultWindow = null;  //声明更新窗口变量
let loginWindow = null;         //声明登录窗口变量
let tray = null;                //声明系统托盘图标变量
let username = null;            //声明用户名变量

//检查更新函数
function checkForUpdates() {
    autoUpdater.autoDownload = false;//关闭自动下载

    //监听到“有可用更新”事件时
    autoUpdater.on("update-available", (info) => {
        createUpdateResultWindow();//创建更新窗口
        updateResultWindow.webContents.send("updateAvailable", info);//发送更新信息到更新窗口
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

//创建系统托盘图标函数
function createTray() {
    const icon = nativeImage.createFromPath(path.join(__dirname, "images", "BSMY.png"));//创建托盘图标的图片对象
    tray = new Tray(icon);//创建托盘图标
    tray.setToolTip("BsmyChat");//设置托盘图标的提示信息
    //托盘图标的点击事件
    tray.on("click", () => {
        mainWindow.show();
    })
    //托盘图标的右键菜单
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: "退出",
            click: () => {
                if (mainWindow !== null) {
                    mainWindow.destroy();//销毁主窗口
                }
                app.quit();//退出应用
            }
        }
    ]))
}

//创建主窗口函数
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        icon: path.join(__dirname, "images", "BSMY.png")
    });
    mainWindow.loadFile("./windows/mainWindow/mainWindow.html");
    mainWindow.on("close", (event) => {//当窗口关闭时
        event.preventDefault();//阻止默认行为
        mainWindow.hide();//隐藏窗口
    })
    //当主窗口加载完毕时
    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send("username", username);  //发送用户名到主窗口
        mainWindow.webContents.send("BSMYPngPath", path.join(__dirname, "images", "BSMY.png"));  //发送BSMY.png路径到主窗口
    })
    //当接收到显示主窗口请求时
    ipcMain.on("showMainWindow", (event) => {
        mainWindow.show();
    })
};

//创建更新窗口的函数
function createUpdateResultWindow() {
    updateResultWindow = new BrowserWindow({
        width: 300,
        height: 200,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        icon: path.join(__dirname, "images", "BSMY.png")
    });
    updateResultWindow.loadFile("./windows/updateResultWindow/updateResultWindow.html");
    updateResultWindow.on("closed", () => {//当窗口关闭时
        updateResultWindow = null;//清理窗口变量
    })
};

//创建登录窗口的函数
function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        icon: path.join(__dirname, "images", "BSMY.png")
    })
    loginWindow.loadFile("./windows/loginWindow/loginWindow.html");
}

//启动应用
app.on("ready", () => {
    Menu.setApplicationMenu(null)   //删除默认菜单
    createTray();                   //创建系统托盘图标
    checkForUpdates();              //检查更新
    createLoginWindow();            //创建登录窗口
});

//监听创建主窗口请求
ipcMain.on("createMainWindow", (event) => {
    createMainWindow();
    loginWindow.destroy();
});

//转发登录窗口中的用户名到主窗口以，连接到WebSocket服务器
ipcMain.on("username", (event, newUsername) => {
    username = newUsername;
})

//监听更新记录到文件请求
ipcMain.on("UpdateChatHistoryToFile", (event, messageData) => {
    let ChatHistoryToFilePath = path.join("C:", "BSMY", "BsmyChat", "ChatHistory", username);//获取聊天记录保存路径
    let chatHistoryDocument = `${messageData[1]}.txt`;//聊天记录文件名
    fs.appendFile(
        path.join(ChatHistoryToFilePath, chatHistoryDocument), 
        messageData[0] + ": " + messageData[2] + "\n",
        "utf-8",
        (error) => {
            if (error) {
                console.log(error);
            }
        }
    )
})

//监听读取聊天记录请求
ipcMain.handle("ReadChatHistory", (event, contacts) => {
    let chatHistoryToFilePath = path.join("C:", "BSMY", "BsmyChat", "ChatHistory", username);//获取聊天记录保存路径
    let chatHistoryDocument = `${contacts}.txt`;//聊天记录文件名
    //创建聊天记录保存路径
    fs.mkdir(chatHistoryToFilePath, { recursive: true }, (error) => {
        if (error) {
            console.log(error);
        }
    })
    if (!fs.existsSync(path.join(chatHistoryToFilePath, chatHistoryDocument))) {
        fs.writeFileSync(path.join(chatHistoryToFilePath, chatHistoryDocument), "");
    }
    return fs.readFileSync(path.join(chatHistoryToFilePath, chatHistoryDocument), "utf-8");
})

//监听log请求
ipcMain.on("log", (event, log) => {
    console.log(log);
})