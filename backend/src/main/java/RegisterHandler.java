import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class RegisterHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        Data data;     //声明一个存放信息的data
        if (httpExchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Origin");
            httpExchange.sendResponseHeaders(200, 0);
        }
        if (httpExchange.getRequestMethod().equalsIgnoreCase("POST")) {
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Origin");
            //从请求中获取数据
            try (InputStream inputStream = httpExchange.getRequestBody();
                 Reader reader = new InputStreamReader(inputStream)) {
                data = new ObjectMapper().readValue(reader, Data.class);
            }

            String sql = "INSERT INTO user (username, password) VALUES (?, ?);";
            try (Connection connection = ConnectDatabase.getConnection();
                 PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
                preparedStatement.setString(1, data.getUsername());
                preparedStatement.setString(2, data.getPassword());
                int result = preparedStatement.executeUpdate();
                if (result > 0) {
                    httpExchange.sendResponseHeaders(200, 0);
                } else {
                    httpExchange.sendResponseHeaders(500, 0);
                }
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
