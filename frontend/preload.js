const { contextBridge, ipcRenderer, } = require("electron")

contextBridge.exposeInMainWorld("myAPI", {
    //监听“有可用更新”事件
    onUpdateAvailable: (callback) => {
        if (typeof callback === "function") {
            ipcRenderer.on("updateAvailable", callback);
        } else {
            console.error("callback is not a function");
        }
    },

    //监听error事件
    onError: (callback) => {
        if (typeof callback === "function") {
            ipcRenderer.on("error", callback);
        } else {
            console.error("callback is not a function");
        }
    },

    //监听下载进度信息
    onDownloadProgress: (callback) => {
        if (typeof callback === "function") {
            ipcRenderer.on("downloadProgress", callback);
        } else {
            console.error("callback is not a function");
        }
    },

    //监听更新下载完成信息
    onUpdateDownloaded: (callback) => {
        if (typeof callback === "function") {
            ipcRenderer.on("updateDownloaded", callback);
        } else {
            console.error("callback is not a function");
        }
    },

    //监听用户名信息
    onUsername: (callback) => {
        if (typeof callback === "function") {
            ipcRenderer.on("username", callback);
        } else {
            console.error("callback is not a function");
        }
    },

    //监听BSMY.png路径信息
    onBSMYPngPath: (callback) => {
        if (typeof callback === "function") {
            ipcRenderer.on("BSMYPngPath", callback);
        } else {
            console.error("callback is not a function");
        }
    },

    //发送下载更新请求
    sendDownloadUpdate: () => {
        ipcRenderer.send("downloadUpdate");
    },

    //发送安装更新请求
    sendQuitAndInstall: () => {
        ipcRenderer.send("quitAndInstall");
    },

    //发送创建主窗口请求
    sendCreateMainWindow: () => {
        ipcRenderer.send("createMainWindow");
    },

    //发送注册窗口请求
    sendCreateRegisterWindow: () => {
        ipcRenderer.send("createRegisterWindow");
    },

    //发送用户名信息
    sendUsername: (username) => {
        ipcRenderer.send("username", username);
    },

    //发送显示主窗口请求
    sendShowMainWindow: () => {
        ipcRenderer.send("showMainWindow");
    }
});