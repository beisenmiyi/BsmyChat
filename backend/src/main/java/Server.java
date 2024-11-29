import com.sun.net.httpserver.HttpServer;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.io.IOException;
import java.net.InetSocketAddress;

//服务器类
public class Server {
    public static void main(String[] args) throws IOException {
        //创建HTTP服务器
        HttpServer httpServer = HttpServer.create(new InetSocketAddress("0.0.0.0", 49152), 10);
        httpServer.createContext("/login", new LoginHandler());//创建登录处理器
        httpServer.setExecutor(null);//设置线程池，这里设置为null表示使用单线程
        httpServer.start();
        System.out.println("HTTP服务器已启动，监听地址：0.0.0.0:49152");

        //创建WebSocket服务器
        WebSocketServer webSocketServer = new myWebSocketServer("0.0.0.0", 49153);
        webSocketServer.start();
    }

    //创建继承于WebSocketServer类的子类
    static class myWebSocketServer extends WebSocketServer {
        myWebSocketServer(String host, int port) {
            super(new InetSocketAddress(host, port));
        }

        @Override
        public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
            System.out.println("WebSocket连接成功");
        }

        @Override
        public void onClose(WebSocket webSocket, int i, String s, boolean b) {

        }

        @Override
        public void onMessage(WebSocket webSocket, String s) {

        }

        @Override
        public void onError(WebSocket webSocket, Exception e) {
            e.printStackTrace();
        }

        @Override
        public void onStart() {
            System.out.println("WebSocket服务器已启动，监听地址：0.0.0.0:49153");
        }
    }
}
