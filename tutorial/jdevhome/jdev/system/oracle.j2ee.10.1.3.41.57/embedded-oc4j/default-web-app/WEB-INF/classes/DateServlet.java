/*
 * @(#)DateServlet.java	1.12 97/08/29
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
import java.util.Date;
import java.util.Hashtable;

import javax.servlet.*;
import javax.servlet.http.*;

/**
 * Date Servlet
 * <p/>
 * This is a simple servlet to demonstrate server-side include
 * It returns a string representation of the current time.
 *
 * @author Scott Atwood
 * @version 1.12, 08/29/97
 */
public class DateServlet extends HttpServlet {
    public void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        Date today = new Date();
        res.setContentType("text/plain");

        ServletOutputStream out = res.getOutputStream();
        out.println(today.toString());
    }


    public String getServletInfo() {
        return "Returns a string representation of the current time";
    }

}
