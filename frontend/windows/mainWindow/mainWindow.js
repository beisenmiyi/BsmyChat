const chatRecordArea = document.getElementById("chatRecordArea");       //聊天记录区域
const inputMessage = document.getElementById("inputMessage");           //消息输入框
const sendMessageButton = document.getElementById("sendMessageButton"); //发送消息按钮
const chatWindow = document.getElementById("chatWindow")                //聊天窗口
const contactsList = document.getElementById("contactsList")            //联系人列表
const chatHeader = document.getElementById("chatHeader")                //聊天窗口头部

let BSMYPngPath = null;                     //BSMY.png路径
let contacts = null;                        //接收者用户名

chatWindow.style.display = "none";//隐藏聊天窗口

//当接收到登录用户名时
window.myAPI.onUsername((event, username) => {
    
    const webSocket = new WebSocket(`ws://103.197.184.184:11663?username=${username}`); //连接websocket服务器

    //发送消息按钮点击事件
    sendMessageButton.addEventListener("click", () => {
        let message = {
            "username": username,
            "contacts": contacts,
            "message": inputMessage.value
        }
        webSocket.send(JSON.stringify(message));
        inputMessage.value = "";
    });

    //获取BSMY.png路径
    window.myAPI.onBSMYPngPath((event, newBSMYPngPath) => {
        BSMYPngPath = newBSMYPngPath;
    });

    //webSocket消息接收事件
    webSocket.onmessage = (message) => {
        chatRecordArea.innerText = chatRecordArea.innerText + message.data + "\n";//更新聊天记录
        chatRecordArea.scrollTop = chatRecordArea.scrollHeight;         //滚动条滚动到底部
        window.myAPI.sendUpdateChatHistoryToFile(message.data.split(":")[0], message.data);//更新聊天记录到文件
        //显示通知
        if (message.data.split(":")[0] !== username) {
            new Notification("新消息", {
                body: message.data,
                icon: BSMYPngPath
            }).onclick = () => {
                window.myAPI.sendShowMainWindow();//点击通知后显示聊天窗口
            }
        }
    }

    //监听联系人列表点击事件
    contactsList.addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
            contacts = event.target.innerText;  //获取选中的联系人用户名
            chatWindow.style.display = "flex";  //显示聊天窗口
            chatHeader.innerText = contacts;    //更新聊天窗口头部
        }
    })
})