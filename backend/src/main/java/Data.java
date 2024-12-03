public class Data {
    private String username;
    private String password;
    private String contacts;
    private String message;

    void setUsername(String username) {     //设置用户名
        this.username = username;
    }
    void setPassword(String password) {     //设置密码
        this.password = password;
    }
    void setContacts(String contacts) {     //设置联系人
        this.contacts = contacts;
    }

    void setMessage(String message) {     //设置消息
        this.message = message;
    }


    String getUsername() {   //获取用户名
        return username;
    }
    String getPassword() {   //获取密码
        return password;
    }
    String getContacts() {   //获取联系人
        return contacts;
    }
    String getMessage() {   //获取消息
        return message;
    }
}
