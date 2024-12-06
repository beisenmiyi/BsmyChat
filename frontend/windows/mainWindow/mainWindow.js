const chatRecordArea = document.getElementById("chatRecordArea");       //聊天记录区域
const inputMessage = document.getElementById("inputMessage");           //消息输入框
const sendMessageButton = document.getElementById("sendMessageButton"); //发送消息按钮
const chatWindow = document.getElementById("chatWindow");               //聊天窗口
const contactsList = document.getElementById("contactsList");           //联系人列表框
const contactsListUl = document.getElementById("contactsListUl");       //联系人列表ul
const chatHeader = document.getElementById("chatHeader");               //聊天窗口头部
const addContactsButton = document.getElementById("addContactsButton"); //添加联系人按钮
const contactSearchInput = document.getElementById("contactSearchInput");//搜索联系人输入框

let BSMYPngPath = null;                     //BSMY.png路径
let contacts = null;                        //接收者用户名

// chatWindow.style.display = "none";//隐藏聊天窗口

//当接收到登录用户名时
window.myAPI.onUsername((event, username) => {
    
    const webSocket = new WebSocket(`ws://103.197.184.184:11663?username=${username}`); //连接websocket服务器

    //发送消息按钮点击事件
    sendMessageButton.addEventListener("click", () => {
        let message = {
            "username": username,
            "contacts": contacts,
            "message": inputMessage.innerText
        }
        webSocket.send(JSON.stringify(message));
        inputMessage.innerText = "";
    });

    //获取BSMY.png路径
    window.myAPI.onBSMYPngPath((event, newBSMYPngPath) => {
        BSMYPngPath = newBSMYPngPath;
    });

    //webSocket消息接收事件
    webSocket.onmessage = (message) => {
        let messageData = message.data.split("/");  //分割消息数据
        chatRecordArea.innerText = chatRecordArea.innerText + messageData[0] + ": " + messageData[2] + "\n";//更新聊天记录
        chatRecordArea.scrollTop = chatRecordArea.scrollHeight;         //滚动条滚动到底部
        window.myAPI.sendUpdateChatHistoryToFile(messageData);          //更新聊天记录到文件
        //显示通知
        if (messageData[0] !== username) {
            new Notification("新消息", {
                body: message.data,
                icon: BSMYPngPath
            }).onclick = () => {
                window.myAPI.sendShowMainWindow();//点击通知后显示聊天窗口
            }
        }
    }

    //监听联系人列表点击事件
    contactsList.addEventListener("click",async (event) => {
        if (event.target.tagName === "LI") {
            contacts = event.target.innerText;  //获取选中的联系人用户名
            chatWindow.style.display = "flex";  //显示聊天窗口
            chatHeader.innerText = contacts;    //更新聊天窗口头部
            let log = await window.myAPI.sendReadChatHistory(contacts); //读取聊天记录请求
            chatRecordArea.innerText = log;     //显示聊天记录
            chatRecordArea.scrollTop = chatRecordArea.scrollHeight;     //滚动条滚动到底部
        }
    })

    //加载联系人列表函数
    async function loadContactsList() {
        try {
            const response = await fetch("http://103.197.184.184:46640/loadContacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": username
                })
            })
            if (response.ok) {
                const data = await response.json();
                contactsListUl.innerHTML = "";
                let li = document.createElement("li");
                li.innerText = "public";
                contactsListUl.appendChild(li);
                for (let i = 0; i < data.length; i++) {
                    const li = document.createElement("li");
                    li.innerText = data[i].contacts;
                    contactsListUl.appendChild(li);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //添加联系人按钮点击事件
    addContactsButton.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://103.197.184.184:46640/addContacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": username,
                    "contacts": contactSearchInput.value
                })
            })
            if (response.ok) {
                loadContactsList();
            }
            if (response.status === 401) {
                contactSearchInput.value = "查无此人";
            }
            if (response.status === 500){
                contactSearchInput.value = "服务器错误";
            }
        } catch (error) {
            console.log(error);
        }
    })

    //加载联系人列表
    loadContactsList();
})