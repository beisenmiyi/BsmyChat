const loginButton = document.getElementById("loginButton");        //获取登录按钮元素
const usernameInput = document.getElementById("usernameInput");    //获取用户名输入框元素
const passwordInput = document.getElementById("passwordInput");    //获取密码输入框元素

// 监听登录按钮点击事件
loginButton.addEventListener("click", async (event) => {
    try {
        //连接HTTP服务器并发出登录请求
        const response = await fetch("http://103.197.184.184:46640/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  //JSON格式发送数据
            },
            body: JSON.stringify({
                "username": usernameInput.value,    //获取用户名输入框的值
                "password": passwordInput.value     //获取密码输入框的值
            })
        })
        if (response.ok) {
            window.myAPI.sendCreateMainWindow();    //登录成功后创建主窗口
        } else {
            alert("登录失败，请检查用户名和密码是否正确！");
        }
    } catch (error) {
        console.log(error)
    }
})