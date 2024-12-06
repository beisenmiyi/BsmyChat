const registerButton = document.getElementById("registerButton");   //获取注册按钮元素
const username = document.getElementById("username");               //获取用户名输入框元素
const password = document.getElementById("password");               //获取密码输入框元素
const confirmPassword = document.getElementById("confirmPassword"); //获取确认密码输入框元素
const registerResult = document.getElementById("registerResult");   //获取错误提示元素
const login = document.getElementById("login");                     //获取登录按钮元素

//监听注册按钮点击事件
registerButton.addEventListener("click", async () => {
    registerResult.innerText = ""; //清空错误提示
    if (password.value === confirmPassword.value) {
        try {
            const response = await fetch("http://103.197.184.184:46640/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": username.value,
                    "password": password.value
                })
            })
            if (response.ok) {
                registerResult.innerText = "注册成功";
            } else {
                registerResult.innerText = "注册失败";
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        registerResult.innerText = "两次输入的密码不一致";
    }
})

//监听登录按钮点击事件
login.addEventListener("click", () => {
    window.location.href = "../loginWindow/loginWindow.html";
})