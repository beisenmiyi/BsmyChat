import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectDatabase {
    private static final String url = "jdbc:mysql://localhost:3306/BsmyChat";
    private static final String username = "users";
    private static final String password = "123456";

    static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }
}