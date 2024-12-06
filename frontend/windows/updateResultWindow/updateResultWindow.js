const updateInfo = document.getElementById("updateInfo");                       //更新信息元素
const downloadProgress = document.getElementById("downloadProgress");           //下载进度元素
const downloadOrInstallBtn = document.getElementById("downloadOrInstallBtn");   //下载或安装更新按钮

//监听更新信息
window.myAPI.onUpdateAvailable((event, info) => {
    updateInfo.innerHTML = "发现新版本v" + info.version + "<br>" + "更新内容：" + "<br>" + info.releaseNotes;
});

//监听下载进度信息
window.myAPI.onDownloadProgress((event, progressObj) => {
    downloadProgress.innerText = "下载中：" + progressObj.percent + "%";
});

//监听下载完成信息
window.myAPI.onUpdateDownloaded((event) => {
    downloadProgress.textContent = "下载完成"
    downloadOrInstallBtn.textContent = "立即安装";
});

//监听“立即更新”按钮点击事件
downloadOrInstallBtn.addEventListener("click", () => {
    if (downloadOrInstallBtn.textContent === "下载更新") {
        downloadOrInstallBtn.textContent = "下载中";
        window.myAPI.sendDownloadUpdate();//发送下载更新请求
    }
    if (downloadOrInstallBtn.textContent === "立即安装") {
        downloadOrInstallBtn.textContent = "安装中";
        window.myAPI.sendQuitAndInstall();//发送安装更新请求
    }
});