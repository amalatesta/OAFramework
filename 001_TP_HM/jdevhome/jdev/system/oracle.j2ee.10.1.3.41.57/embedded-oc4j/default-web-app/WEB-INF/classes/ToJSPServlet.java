
import javax.servlet.*;
import javax.servlet.http.*;

/**
 * An example servlet demonstrating a servlet forwarding to a JSP-page.
 */
public class ToJSPServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Set the attribute and Forward to hello.jsp
            request.setAttribute("servletName", "ServletToJSP");
            getServletConfig().getServletContext().getRequestDispatcher("/examples/jsp/jsptoserv/hello.jsp").forward(request, response);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
