import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LoadContactsHandler implements HttpHandler {
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
            }
            String sql = "SELECT CASE WHEN userA = ? THEN userB ELSE userA END AS contacts FROM contacts WHERE userA = ? OR userB = ?";
            try (Connection connection = ConnectDatabase.getConnection()) {
                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1,data.getUsername());
                preparedStatement.setString(2,data.getUsername());
                preparedStatement.setString(3,data.getUsername());
                ResultSet resultSet = preparedStatement.executeQuery();
                ResultSetMetaData metaData = resultSet.getMetaData();
                int columnCount = metaData.getColumnCount();
                List<Map<String, Object>> resultList = new ArrayList<>();
                while (resultSet.next()) {
                    Map<String, Object> row = new HashMap<>();
                    for (int i = 1; i <= columnCount; i++) {
                        row.put(metaData.getColumnName(i), resultSet.getString(i));
                    }
                    resultList.add(row);
                }

                ObjectMapper objectMapper = new ObjectMapper();
                byte[] response = objectMapper.writeValueAsBytes(resultList);

                httpExchange.sendResponseHeaders(200, response.length);
                httpExchange.getResponseBody().write(response);
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
