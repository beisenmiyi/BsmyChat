const updateResultWindow = document.getElementById("updateResultWindow");
const immediatelyUpdateBtn = document.getElementById("immediatelyUpdateBtn");

//监听更新信息
window.myAPI.onUpdateAvailable((event, info) => {
    updateResultWindow.textContent = "发现新版本v" + info.version;
});

//监听更新错误信息
window.myAPI.onError((event, error) => {
    updateResultWindow.textContent = error;
});

//监听下载进度信息
window.myAPI.onDownloadProgress((event, progressObj) => {
    updateResultWindow.textContent = "下载中：" + progressObj.percent + "%";
});

//监听下载完成信息
window.myAPI.onUpdateDownloaded((event) => {
    updateResultWindow.textContent = "下载完成"
    immediatelyUpdateBtn.textContent = "立即安装";
});

//监听“立即更新”按钮点击事件
immediatelyUpdateBtn.addEventListener("click", () => {
    if (immediatelyUpdateBtn.textContent === "下载更新") {
        immediatelyUpdateBtn.textContent = "下载中";
        window.myAPI.sendDownloadUpdate();//发送下载更新请求
    }
    if (immediatelyUpdateBtn.textContent === "立即安装") {
        window.myAPI.sendQuitAndInstall();//发送安装更新请求
    }
});