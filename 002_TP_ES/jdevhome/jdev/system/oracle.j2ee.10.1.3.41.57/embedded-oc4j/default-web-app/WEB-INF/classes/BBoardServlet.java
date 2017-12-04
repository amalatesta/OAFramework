/*
 * @(#)BBoardServlet.java	1.16 97/05/22
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

/*
 * Bulletin board servlet
 * @author  Rachel Gollub
 */

public class BBoardServlet extends HttpServlet {

    /*
     * This gets the information from the html form, reads the file,
     * and writes to it.
     */
    public void service(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        ServletOutputStream out = res.getOutputStream();
        ServletContext servletContext = getServletContext();
        String bBoardName = servletContext.getRealPath("board.html");
        RandomAccessFile fil = new RandomAccessFile(bBoardName, "rw");
        String entry = req.getParameter("entry");
        String noentry = req.getParameter("noentry");
        String entries[] = new String[50];
        int i;
        entries[0] = null;

        res.setContentType("text/html");

        for (i = 1; i < 50; i++) {
            if (fil.getFilePointer() < fil.length()) {
                entries[i] = fil.readLine();
            } else {
                entries[i] = null;
            }
        }

        /* This bit, including the horrid concat line, writes to the file,
         * replacing all \n characters with <BR>.
         */

        if (entry != null && noentry == null) {
            fil.seek(0);
            while ((i = entry.indexOf("\n")) != -1) {
                entry = entry.substring(0, i - 1).concat("<BR>").concat(entry.substring(i + 1, entry.length()));
            }
            entries[0] = entry;
            fil.writeBytes(entry + "\n");
            for (i = 1; i < 50; i++) {
                if (entries[i] != null) {
                    fil.writeBytes(entries[i] + "\n");
                }
            }
        }
        fil.close();
        BuildBoard(out, entries);
    }


    /*
     * This parses the information into bulletin board entries.
     */
    public void BuildBoard(ServletOutputStream out, String entries[]) throws IOException {
        int i;

        out.print("<HR>");
        for (i = 0; i < 50; i++) {
            if (entries[i] != null) {
                out.print(entries[i]);
                out.print("<HR>");
            }
        }
        out.flush();
    }


    public String getServletInfo() {
        return "This servlet maintains a bulletin board on a server.";
    }

}

