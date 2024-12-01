const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");

let mainWindow = null;          //声明主窗口变量
let updateResultWindow = null;  //声明更新窗口变量
let loginWindow = null;         //声明登录窗口变量
<<<<<<< HEAD
let registerWindow = null;      //声明注册窗口变量

let tray = null;                //声明系统托盘图标变量
let username = null;            //声明用户名变量
=======
let tray = null;                //声明系统托盘图标变量
>>>>>>> 2537d901fdd2024cbed56de836a43f8a3d39b582

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
                mainWindow.destroy();//销毁主窗口
                app.quit();//退出应用
            }
        }
    ]))
}

//创建主窗口函数
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.loadFile("./windows/mainWindow/mainWindow.html");
    mainWindow.on("close", (event) => {//当窗口关闭时
        event.preventDefault();//阻止默认行为
        mainWindow.hide();//隐藏窗口
    })
    //当主窗口加载完毕时
    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send("username", username);  //发送用户名到主窗口
    })
};

//创建更新窗口的函数
function createUpdateResultWindow() {
    updateResultWindow = new BrowserWindow({
        width: 300,
        height: 200,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    updateResultWindow.loadFile("./windows/updateResultWindow/updateResultWindow.html");
    updateResultWindow.on("closed", () => {//当窗口关闭时
        updateResultWindow = null;//清理窗口变量
    })
};

//创建登录窗口的函数
function createLoginWindow() {
    loginWindow = new BrowserWindow({
<<<<<<< HEAD
        width: 300,
        height: 200,
=======
        width: 600,
        height: 400,
>>>>>>> 2537d901fdd2024cbed56de836a43f8a3d39b582
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    loginWindow.loadFile("./windows/loginWindow/loginWindow.html");
}

<<<<<<< HEAD
//创建注册窗口的函数
function createRegisterWindow() {
    registerWindow = new BrowserWindow({
        width: 300,
        height: 200,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    registerWindow.loadFile("./windows/registerWindow/registerWindow.html")
}

=======
>>>>>>> 2537d901fdd2024cbed56de836a43f8a3d39b582
//启动应用
app.on("ready", () => {
    createTray();//创建系统托盘图标
    checkForUpdates();//检查更新
    createLoginWindow();//创建登录窗口
});

//监听创建主窗口请求
ipcMain.on("createMainWindow", (event) => {
    createMainWindow();
    loginWindow.destroy();
<<<<<<< HEAD
});

//监听创建注册窗口请求
ipcMain.on("createRegisterWindow", (event) => {
    createRegisterWindow();//创建注册窗口
})

//转发登录窗口中的用户名到主窗口以，连接到WebSocket服务器
ipcMain.on("username", (event, newUsername) => {
    username = newUsername;
})
=======
});
>>>>>>> 2537d901fdd2024cbed56de836a43f8a3d39b582
