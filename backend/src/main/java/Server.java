import com.sun.net.httpserver.HttpServer;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

//服务器类
public class Server {
    public static void main(String[] args) throws IOException {
        //创建HTTP服务器
        HttpServer httpServer = HttpServer.create(new InetSocketAddress("0.0.0.0", 49152), 10);
        httpServer.createContext("/login", new LoginHandler());         //创建登录处理器
        httpServer.createContext("/register", new RegisterHandler());   //创建注册处理器
        httpServer.setExecutor(null);//设置线程池，这里设置为null表示使用单线程
        httpServer.start();//启动HTTP服务器
        System.out.println("HTTP服务器已启动，监听地址：0.0.0.0:49152");

        //创建WebSocket服务器
        WebSocketServer webSocketServer = new myWebSocketServer("0.0.0.0", 49153);
        webSocketServer.start();//启动WebSocket服务器
    }

    //创建继承于WebSocketServer类的子类
    static class myWebSocketServer extends WebSocketServer {
        //连接到服务器的对象集合
        Map<String, WebSocket> webSocketMap = new HashMap<>();

        //构造函数
        myWebSocketServer(String host, int port) {
            super(new InetSocketAddress(host, port));
        }

        @Override
        public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {//连接建立时调用
            String query = clientHandshake.getResourceDescriptor();
            String username = query.split("=")[1];
//            System.out.println(username);
            webSocketMap.put(username, webSocket);//将连接到服务器的对象添加到集合中
            System.out.println(username + "\t" + "已连接" + "\t" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }

        @Override
        public void onClose(WebSocket webSocket, int i, String s, boolean b) {//连接关闭时调用
            for (Map.Entry<String, WebSocket> entry : webSocketMap.entrySet()) {
                if (entry.getValue() == webSocket) {
                    webSocketMap.remove(entry.getKey());//将断开连接的对象从集合中移除
                    System.out.println(entry.getKey() + "\t" + "已断开" + "\t" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    return;
                }
            }
        }

        @Override
        public void onMessage(WebSocket webSocket, String s) {//接收到消息时调用
            for (WebSocket webSocket1 : webSocketMap.values()) {//向所有连接到服务器的对象发送消息
                webSocket1.send(s);//向所有连接到服务器的对象发送消息
            }
        }

        @Override
        public void onError(WebSocket webSocket, Exception e) {//出现错误时调用
            System.out.println(e.getMessage());
        }

        @Override
        public void onStart() {//服务器启动时调用
            System.out.println("WebSocket服务器已启动，监听地址：0.0.0.0:49153");
        }
    }
}
