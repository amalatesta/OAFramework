/*
 * @(#)HelloWorldServlet.java	1.9 97/05/22
 * 
 * Copyright (c) 1995, 2004, Oracle. All rights reserved.  
 * 
 * This software is the confidential and proprietary information of Sun
 * Microsystems, Inc. ("Confidential Information").  You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Sun.
 * 
 * SUN MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF THE
 * SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE, OR NON-INFRINGEMENT. SUN SHALL NOT BE LIABLE FOR ANY DAMAGES
 * SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 * 
 * CopyrightVersion 1.0
 */

import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;

/**
 * Hello World. This servlet simply says hi.
 * <p/>
 * This is useful for testing our servlet admin tool, since
 * this servlet isn't started up by default when Jeeves starts up.
 * Load it by going to http://<server>/admin/servlet.html
 * and giving it the name "hello" and the class "HelloWorldServlet".
 * Then, invoke by using the URL http://<server>/servlet/hello
 */

public
class HelloWorldServlet extends HttpServlet {

    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/html");

        ServletOutputStream out = res.getOutputStream();
        out.println("<html>");
        out.println("<head><title>Hello World</title></head>");
        out.println("<body>");
        out.println("<h1>Hello World</h1>");
        out.println("</body></html>");
    }


    public String getServletInfo() {
        return "Create a page that says <i>Hello World</i> and send it back";
    }
}
