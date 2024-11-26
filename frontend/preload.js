const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("myAPI", {
    onError: (callback) => {
        if (typeof callback === "function") {
            ipcRenderer.on("error", callback);
        } else {
            console.error("callback is not a function");
        }
    },

    onUpdateAvailable: (callback) => {
        if (typeof callback === "function") {
            ipcRenderer.on("update-available", callback);
        } else {
            console.error("callback is not a function");
        }
    },

    onDownloadProgress: (callback) => {
        if (typeof callback === "function") {
            ipcRenderer.on("download-progress", callback);
        } else {
            console.error("callback is not a function");
        }
    }
});