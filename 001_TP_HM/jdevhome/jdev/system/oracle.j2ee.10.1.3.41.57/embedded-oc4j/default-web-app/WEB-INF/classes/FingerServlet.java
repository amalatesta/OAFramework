/*
 * @(#)FingerServlet.java	1.12 97/05/22
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
import java.net.*;
import java.util.*;

import javax.servlet.*;
import javax.servlet.http.*;

/**
 * Finger servlet. This servlet uses the finger protocol to query
 * information about users on specified hosts. The query string
 * parameters <tt>user</tt>, <tt>hosts</tt>, and <tt>verbose</tt>
 * can be used to specify the user and hosts to query. The parameter
 * <tt>user</tt> is the user name, <tt>hosts</tt> is a comma-separated
 * list of host names to query, and <tt>verbose</tt> if specified will
 * cause verbose output to be generated. For example,
 * <pre>
 *     http:/goa/finger.html?user=dac&hosts=eno,doppio&verbose=yes
 * </pre>
 * This URL will request full information about user 'dac' on both
 * hosts 'eno' and 'doppio'.
 *
 * @author David Connelly
 * @version 1.12, 05/22/97
 */
public
class FingerServlet extends HttpServlet {
    /*
     * Port number for finger daemon.
     */
    static final int FINGER_PORT = 79;
    private static final String timeoutMessage = "Timeout reading from server";


    /**
     * Handles a single finger request from the client.
     */
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        String user = req.getParameter("user");
        String hosts = req.getParameter("hosts");
        String verbose = req.getParameter("verbose");

        res.setContentType("text/html");

        ServletOutputStream out = res.getOutputStream();
        out.println("<html>");
        out.println("<head><title>Finger Servlet</title></head>");
        out.println("<body>");
        out.println("<h2>Finger results:</h2>");
        out.println("<pre>");
        if (hosts == null) {
            finger(out, user, null, "yes".equalsIgnoreCase(verbose));
        } else {
            StringTokenizer st = new StringTokenizer(hosts, ",");
            while (st.hasMoreTokens()) {
                String host = st.nextToken();
                out.println("[" + host + "]");
                try {
                    finger(out, user, host, "yes".equalsIgnoreCase(verbose));
                } catch (IOException e) {
                    out.println(e.toString());
                }
                out.println();
            }
        }
        out.println("</pre>");
        out.println("</body></html>");
    }


    /*
     * Sends finger output for a user and host to the specified output
     * stream.
     */
    private void finger(ServletOutputStream out, String user, String host,
                        boolean verbose)
            throws IOException {
        // open connection to finger daemon
        Socket s;
        if (host == null) {
            s = new Socket(InetAddress.getLocalHost(), FINGER_PORT);
        } else {
            s = new Socket(host, FINGER_PORT);
        }
        // send finger command
        PrintStream socketOut = new PrintStream(s.getOutputStream());
        if (verbose) {
            socketOut.print("/W ");
        }
        if (user != null) {
            socketOut.print(user);
        }
        socketOut.print("\r\n");
        socketOut.flush();
        // copy results to output stream
        // s.setSoTimeout(30000);
        InputStream in = s.getInputStream();
        byte[] buf = new byte[2048];
        int len;
        try {
            while ((len = in.read(buf, 0, buf.length)) != -1) {
                out.write(buf, 0, len);
            }
        } catch (InterruptedIOException ioe) {
            timeoutMessage.getBytes(0, timeoutMessage.length(), buf, 0);
            out.write(buf, 0, timeoutMessage.length());
        } finally {
            socketOut.close();
            s.close();
        }
    }
}
