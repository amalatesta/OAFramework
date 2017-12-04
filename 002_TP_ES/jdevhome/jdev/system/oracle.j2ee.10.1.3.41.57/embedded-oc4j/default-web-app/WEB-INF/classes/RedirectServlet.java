/*
 * @(#)RedirectServlet.java	1.9 97/05/22
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

import java.io.IOException;

import javax.servlet.*;
import javax.servlet.http.*;

/**
 * This is a basic redirection servlet.  It takes a single
 * destination, which it then redirects the browser to... Useful
 * for logging how many times links off of your site are used.
 * Example: http://www.mysite.com/RedirectServlet?http://anothersite.com/
 */
public class RedirectServlet extends HttpServlet {

    /**
     * Given a request with either extra path info or a QueryString, redirect
     * browser to appropriate site.
     *
     * @param req Request object the servlet uses to get input.
     * @param res Response object that the servlet uses to send output.
     * @throws ServletException @see HttpServlet
     * @throws IOException      occurs due to general network errors.
     */
    public void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        String location = req.getParameter("location");
        String path;
        String query;

        if (location == null) {
            res.sendError(res.SC_INTERNAL_SERVER_ERROR,
                          "Destination not set for redirect; " +
                          "please inform system admin");
            return;
        }

        res.sendRedirect(location);

    }


    /**
     * Obtain information on this servlet.
     *
     * @return String describing this servlet.
     */
    public String getServletInfo() {
        return "Redirect servlet -- used to send redirects";
    }


    /**
     * decode a URLencoded string, so we may use it as a URL
     */
    private String decode(String encoded) {

        //speedily leave if we're not needed
        if (encoded.indexOf('%') == -1) {
            return encoded;
        }

        StringBuffer holdstring = new StringBuffer(encoded.length());
        char holdchar;

        for (int count = 0; count < encoded.length(); count++) {
            if (encoded.charAt(count) == '%') {
                //add check for out of bounds
                holdstring.append((char) Integer.parseInt(encoded.substring(count + 1, count + 3), 16));
                if (count + 2 >= encoded.length()) {
                    count = encoded.length();
                } else {
                    count += 2;
                }
            } else {
                holdstring.append(encoded.charAt(count));
            }
        }
        return holdstring.toString();
    }
}
