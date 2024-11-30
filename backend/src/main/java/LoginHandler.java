import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LoginHandler implements HttpHandler {
    public void handle(HttpExchange exchange) {
        Data data = new Data();                                                     //声明一个存放信息的data
        if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {     //如果请求方法是POST
            try (InputStream inputStream = exchange.getRequestBody();               //获取请求体放入输入流inputStream
                 Reader reader = new InputStreamReader(inputStream)) {              //读取输入流inputStream放入reader
                data = new ObjectMapper().readValue(reader, Data.class);            //将结果reader转换为Data对象
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }

            String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
            try (Connection connection = ConnectDatabase.getConnection();                   //获取数据库连接connection
                 PreparedStatement preparedStatement = connection.prepareStatement(sql)) {  //获取预编译语句preparedStatement
                preparedStatement.setString(1, data.getUsername());             //设置用户名参数
                preparedStatement.setString(2, data.getPassword());             //设置密码参数
                ResultSet resultSet = preparedStatement.executeQuery();            //执行查询语句并获取结果集resultSet
                if (resultSet.next()) {
                    exchange.sendResponseHeaders(200, 0);
                } else {
                    exchange.sendResponseHeaders(401, 0);
                }
            } catch (SQLException | IOException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
