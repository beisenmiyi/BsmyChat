const updateResultWindow = document.getElementById("updateResultWindow");

window.myAPI.onError((event, error) => {
    updateResultWindow.textContent = error;
});

window.myAPI.onUpdateAvailable((event, info) => {
    updateResultWindow.textContent = `New version ${info.version} is available.`;
});

window.myAPI.onDownloadProgress((event, progressObj) => {
    updateResultWindow.textContent = `Downloaded ${progressObj.percent}%`;
});