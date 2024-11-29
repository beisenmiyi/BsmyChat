const updateResultWindow = document.getElementById("updateResultWindow");//内容显示区
const downloadOrInstallBtn = document.getElementById("downloadOrInstallBtn");//下载或安装更新按钮

//监听更新信息
window.myAPI.onUpdateAvailable((event, info) => {
    updateResultWindow.textContent = "发现新版本v" + info.version;
});

//监听更新错误信息
window.myAPI.onError((event, error) => {
    updateResultWindow.textContent = "检查更新出错啦，可能是您的网络问题，请稍后再试，或者前往https://github.com/beisenmiyi/BsmyChat/releases下载最新版本";
});

//监听下载进度信息
window.myAPI.onDownloadProgress((event, progressObj) => {
    updateResultWindow.textContent = "下载中：" + progressObj.percent + "%";
});

//监听下载完成信息
window.myAPI.onUpdateDownloaded((event) => {
    updateResultWindow.textContent = "下载完成"
    downloadOrInstallBtn.textContent = "立即安装";
});

//监听“立即更新”按钮点击事件
downloadOrInstallBtn.addEventListener("click", () => {
    if (downloadOrInstallBtn.textContent === "下载更新") {
        downloadOrInstallBtn.textContent = "下载中";
        window.myAPI.sendDownloadUpdate();//发送下载更新请求
    }
    if (downloadOrInstallBtn.textContent === "立即安装") {
        window.myAPI.sendQuitAndInstall();//发送安装更新请求
    }
});