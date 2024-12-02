const chatRecordArea = document.getElementById("chatRecordArea");//聊天记录区域
const inputMessage = document.getElementById("inputMessage");//消息输入框
const sendMessageButton = document.getElementById("sendMessageButton");//发送消息按钮

let BSMYPngPath = null;                     //BSMY.png路径

//当接收到用户名时
window.myAPI.onUsername((event, username) => {
    
    const webSocket = new WebSocket(`ws://103.197.184.184:11663?username=${username}`); //连接websocket服务器

    //发送消息按钮点击事件
    sendMessageButton.addEventListener("click", () => {
        webSocket.send(inputMessage.value);
        inputMessage.value = "";
    });

    //获取BSMY.png路径
    window.myAPI.onBSMYPngPath((event, newBSMYPngPath) => {
        BSMYPngPath = newBSMYPngPath;
    });

    //webSocket消息接收事件
    webSocket.onmessage = (message) => {
        chatRecordArea.innerText = chatRecordArea.innerText + message.data + "\n";//更新聊天记录
        chatRecordArea.scrollTop = chatRecordArea.scrollHeight; //滚动条滚动到底部
        //显示通知
        new Notification("新消息", {
            body: message.data,
            icon: BSMYPngPath
        }).onclick = () => {
            window.myAPI.sendShowMainWindow();
        }
    }
})