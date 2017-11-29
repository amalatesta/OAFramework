
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class ConfigServlet extends HttpServlet {
    private String parameter;


    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        parameter = config.getInitParameter("parameter");
    }


    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.getOutputStream().println("Config 'parameter': " + parameter);
    }
}
