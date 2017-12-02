/*
 * @(#)UpperCaseFilter.java	1.17 97/03/05
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
import java.util.Enumeration;

import javax.servlet.http.*;
import javax.servlet.*;

/**
 * This is an example of a simple Servlet.
 */
public class UpperCaseFilter extends HttpServlet {

    public void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        Enumeration e = req.getHeaderNames();
        while (e.hasMoreElements()) {
            String header = (String) e.nextElement();
            String value = req.getHeader(header);
            res.setHeader(header, value);
        }

        ServletOutputStream out = res.getOutputStream();
        if (req.getContentType().equals("text/html")) {
            DataInputStream ds = new DataInputStream(req.getInputStream());
            String s;
            while ((s = ds.readLine()) != null) {
                String u = s.toUpperCase();
                if ((u.indexOf("HREF") != -1) ||
                    (u.indexOf("IMG") != -1)) {
                    out.println(s);
                } else {
                    out.println(u);
                }
            }
        } else {
            ServletInputStream in = req.getInputStream();
            int b;
            while ((b = in.read()) != -1) {
                out.write(b);
            }
        }

        out.close();
    }


    public String getServletInfo() {
        return "A simple servlet";
    }

}
