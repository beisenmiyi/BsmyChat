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

public class AddContactsHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        Data data;
        if (httpExchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            httpExchange.sendResponseHeaders(200, 0);
        }
        if (httpExchange.getRequestMethod().equalsIgnoreCase("POST")) {
            try (InputStream inputStream = httpExchange.getRequestBody();
                 Reader reader = new InputStreamReader(inputStream)) {
                data = new ObjectMapper().readValue(reader, Data.class);

                String selectSQL = "SELECT * FROM user WHERE username = ?;";
                String addSQL = "INSERT INTO contacts (userA, userB) VALUES (LEAST(?, ?), GREATEST(?, ?));";

                try (Connection connection = ConnectDatabase.getConnection()) {
                    try (PreparedStatement preparedStatement = connection.prepareStatement(selectSQL)) {
                        preparedStatement.setString(1, data.getContacts());
                        ResultSet resultSet = preparedStatement.executeQuery();
                        if (resultSet.next()) {
                            System.out.println("有这个用户");
                            try (PreparedStatement preparedStatement1 = connection.prepareStatement(addSQL)) {
                                preparedStatement1.setString(1, data.getUsername());
                                preparedStatement1.setString(2, data.getContacts());
                                preparedStatement1.setString(3, data.getUsername());
                                preparedStatement1.setString(4, data.getContacts());
                                System.out.println("test1");
                                int result = preparedStatement1.executeUpdate();
                                System.out.println("test2");
                                if (result > 0) {
                                    System.out.println("添加成功");
                                    httpExchange.sendResponseHeaders(200, 0);
                                } else {
                                    System.out.println("添加失败");
                                     httpExchange.sendResponseHeaders(500, 0);
                                }
                            } catch (SQLException e) {
                                e.printStackTrace();
                            }
                        } else {
                            System.out.println("没有这个用户");
                            httpExchange.sendResponseHeaders(401, 0);
                        }
                    } catch (SQLException e) {
                        throw new RuntimeException(e);
                    }
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}
