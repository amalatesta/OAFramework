
import java.io.*;
import java.util.Date;
import java.util.Hashtable;

import javax.servlet.*;
import javax.servlet.http.*;


/**
 * Display text files in the client browsers given their pathInfo
 */
public class ViewSrc extends HttpServlet {
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        ServletOutputStream out = res.getOutputStream();
        res.setContentType("text/html");
        String theFile = req.getPathInfo();
        ServletContext sc = getServletContext();
        String realPath = sc.getRealPath(theFile);
        if (theFile == null) {
            throw new ServletException("Missing or Invalid file name: " + theFile);
        }
        if (!isAllowedToSee(theFile)) {
            throw new ServletException("Not authorized access.");
        }
        FileInputStream in = new FileInputStream(realPath);
        if (in == null) {
            throw new ServletException("Unable to find file: " + theFile);
        }
        InputStreamReader reader = new InputStreamReader(in);
        try {
            out.println("<body>");
            out.println("<pre>");
            for (int ch = in.read(); ch != -1; ch = in.read()) {
                if (ch == '<') {
                    out.print("&lt;");
                } else if (ch == '&') {
                    out.print("&amp;");
                } else {
                    out.print((char) ch);
                }
            }
            out.println("</pre>");
            out.println("</body>");
        } catch (IOException ex) {
            throw new IOException("IOException: " + ex.toString());
        }
    }


    public String getServletInfo() {
        return "Displays in html format the file given on the request";
    }


    /**
     * Specify all files that are allowed to see
     * so as to restrict the power of this class
     */
    private boolean isAllowedToSee(String file) {
        String[] allowedFiles = {
            "/WEB-INF/classes/ServletToJsp.java",
            "/WEB-INF/classes/cal/Entries.java",
            "/WEB-INF/classes/cal/Entry.java",
            "/WEB-INF/classes/cal/JspCalendar.java",
            "/WEB-INF/classes/cal/TableBean.java",
            "/WEB-INF/classes/error/Smart.java",
            "/WEB-INF/classes/examples/ExampleTagBase.java",
            "/WEB-INF/classes/examples/FooTag.java",
            "/WEB-INF/classes/examples/FooTagExtraInfo.java",
            "/WEB-INF/classes/examples/LogTag.java",
            "/WEB-INF/classes/jsp2/examples/BookBean.java",
            "/WEB-INF/classes/jsp2/examples/FooBean.java",
            "/WEB-INF/classes/jsp2/examples/el/Functions.java",
            "/WEB-INF/classes/jsp2/examples/simpletag/EchoAttributesTag.java",
            "/WEB-INF/classes/jsp2/examples/simpletag/FindBookSimpleTag.java",
            "/WEB-INF/classes/jsp2/examples/simpletag/HelloWorldSimpleTag.java",
            "/WEB-INF/classes/jsp2/examples/simpletag/RepeatSimpleTag.java",
            "/WEB-INF/classes/jsp2/examples/simpletag/ShuffleSimpleTag.java",
            "/WEB-INF/classes/jsp2/examples/simpletag/TileSimpleTag.java",
            "/WEB-INF/classes/num/NumberGuessBean.java",
            "/WEB-INF/tags/displayProducts.tag",
            "/WEB-INF/tags/helloWorld.tag",
            "/WEB-INF/tags/panel.tag",
            "/WEB-INF/tags/xhtmlbasic.tag",
            "/examples/jsp/cal/cal1.jsp",
            "/examples/jsp/cal/cal2.jsp",
            "/examples/jsp/checkbox/checkresult.jsp",
            "/examples/jsp/colors/colrs.jsp",
            "/examples/jsp/dates/date.jsp",
            "/examples/jsp/demoUtil.jsp",
            "/examples/jsp/error/err.jsp",
            "/examples/jsp/error/error.html",
            "/examples/jsp/error/errorpge.jsp",
            "/examples/jsp/forward/forward.jsp",
            "/examples/jsp/forward/one.jsp",
            "/examples/jsp/forward/two.html",
            "/examples/jsp/include/foo.jsp",
            "/examples/jsp/include/include.jsp",
            "/examples/jsp/jsp2/el/basic-arithmetic.jsp",
            "/examples/jsp/jsp2/el/basic-comparisons.jsp",
            "/examples/jsp/jsp2/el/functions.jsp",
            "/examples/jsp/jsp2/el/implicit-objects.jsp",
            "/examples/jsp/jsp2/jspattribute/jspattribute.jsp",
            "/examples/jsp/jsp2/jspattribute/shuffle.jsp",
            "/examples/jsp/jsp2/jspx/basic.jspx",
            "/examples/jsp/jsp2/jspx/textRotate.jspx",
            "/examples/jsp/jsp2/misc/coda.jspf",
            "/examples/jsp/jsp2/misc/config.jsp",
            "/examples/jsp/jsp2/misc/dynamicattrs.jsp",
            "/examples/jsp/jsp2/misc/prelude.jspf",
            "/examples/jsp/jsp2/simpletag/book.jsp",
            "/examples/jsp/jsp2/simpletag/hello.jsp",
            "/examples/jsp/jsp2/simpletag/repeat.jsp",
            "/examples/jsp/jsp2/tagfiles/hello.jsp",
            "/examples/jsp/jsp2/tagfiles/panel.jsp",
            "/examples/jsp/jsp2/tagfiles/products.jsp",
            "/examples/jsp/jsptoserv/hello.jsp",
            "/examples/jsp/jsptoserv/jsptoservlet.jsp",
            "/examples/jsp/num/numguess.jsp",
            "/examples/jsp/plugin/plugin.jsp",
            "/examples/jsp/sessions/carts.jsp",
            "/examples/jsp/simpletag/foo.jsp",
            "/examples/jsp/snp/snoop.jsp",
            "/examples/jsp/taglib/loop/LoopTag.java",
            "/examples/jsp/taglib/loop/looptag.jsp",
            "/examples/jsp/xml/xml.jsp",
        };
        boolean isAllowed = false;
        for (int i = 0; i < allowedFiles.length; i++) {
            if (file.equals(allowedFiles[i])) {
                isAllowed = true;
                break;
            }
        }
        return isAllowed;
    }
}

    
        
    

