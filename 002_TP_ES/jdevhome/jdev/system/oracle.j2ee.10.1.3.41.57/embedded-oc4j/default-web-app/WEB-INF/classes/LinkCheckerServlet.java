/*
 * @(#)LinkCheckerServlet.java	1.22 97/10/21
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


import java.lang.*;
import java.net.*;
import java.util.*;
import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;

public class LinkCheckerServlet extends HttpServlet {

    /**
     * Administrator's email address
     */
    protected static String webmaster;

    /**
     * Robot Name
     */
    protected static final String robot = "JeevesLinkChecker/1.0";


    /**
     * Creates a new LinkCheckerServlet
     */
    public LinkCheckerServlet() {
    }


    /**
     * Services a single request from a client.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @throws IOException If an I/O error has occured
     */

    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        String firstpage = req.getParameter("base");
        String maxDepthStr = req.getParameter("max_depth");
        String searchall = req.getParameter("search");
        int maxDepth;
        String testHost;
        Hashtable noticedLinks = new Hashtable(100);
        Vector unprocessedLinks = new Vector(100);
        URLInfo base = new URLInfo();
        ServletOutputStream out = res.getOutputStream();

        res.setContentType("text/html");

        if (searchall.equals("0")) {
            try {
                maxDepth = Integer.parseInt(maxDepthStr);
            } catch (Exception e) {
                maxDepth = 50;
            }
        } else {
            maxDepth = 50;
        }

        if ((maxDepth > 50) || (maxDepth < 0)) {
            maxDepth = 50;
        }

        try {
            base.url = new URL(firstpage);

            // Do some sanity checking on the URL.
            if (!base.url.getProtocol().equals("http")) {
                throw new MalformedURLException("protocol must be \"http\"");
            } else if (base.url.getHost().length() == 0) {
                throw new MalformedURLException("no host name specified");
            }

        } catch (MalformedURLException e) {
            out.println("Cannot process the URL: " + e.getMessage() +
                        ". Make sure the URL starts with \"http://host_name\".");
            return;
        }

        base.referers = null;
        base.depth = 0;
        noticedLinks.put(base.url, base);
        unprocessedLinks.addElement(base);

        testHost = base.url.getHost();

        webmaster = "webmaster@" + testHost;

        while (!unprocessedLinks.isEmpty()) {
            URLInfo nextLink = (URLInfo) unprocessedLinks.firstElement();
            unprocessedLinks.removeElementAt(0);
            if (nextLink.url.getHost().equals(testHost)) {
                try {
                    getHead(nextLink);
                } catch (Exception e) {
                    nextLink.statusCode = 0;
                    nextLink.reasonPhrase = "Could not open connection.";
                    nextLink.contentType = "none";
                }
            } else {
                nextLink.statusCode = 1;
                nextLink.reasonPhrase = "Not on local host.";
                nextLink.contentType = "unknown";
            }
            try {
                if (nextLink.depth <= maxDepth - 1 &&
                    nextLink.url.getHost().equals(testHost) &&
                    nextLink.contentType.equals("text/html") &&
                    (nextLink.url.toString().indexOf("#") == -1)) {
                    parseContent(nextLink, noticedLinks, unprocessedLinks);
                }
            } catch (Exception e) {
            }
        }
        sendResponse(out, noticedLinks);
        out.flush();
    }


    /**
     * Returns the header information for a given URL.
     *
     * @param info The information for the URL.
     */
    protected void getHead(URLInfo info)
            throws IOException {
        Socket socket = null;
        PrintStream out;
        //DataInputStream in;
        BufferedReader in;
        String line;
        int i, j;
        Hashtable headers = new Hashtable();

        if (info.url.getPort() == -1) {
            socket = new Socket(info.url.getHost(), 80);
        } else {
            socket = new Socket(info.url.getHost(), info.url.getPort());
        }
        out = new PrintStream(socket.getOutputStream());
        //in = new DataInputStream(socket.getInputStream());
        in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

        out.println("HEAD " + info.url.getFile() + " HTTP/1.0");
        out.println("From: " + webmaster);
        out.println("User-Agent: " + robot);
        if (info.referers != null && !info.referers.isEmpty()) {
            out.println("Referer: " +
                        ((URL) info.referers.firstElement()).toString());
        }
        out.println();

        line = in.readLine();
        i = line.indexOf(' ');
        j = line.indexOf(' ', i + 1);
        try {
            info.statusCode = Integer.parseInt(line.substring(i + 1, j));
        } catch (NumberFormatException e) {
            info.statusCode = 0;
        }
        info.reasonPhrase = line.substring(j + 1);

        while ((line = in.readLine()) != null) {
            i = line.indexOf(' ');
            if (i > 0) {
                headers.put(line.substring(0, i - 1).toLowerCase(),
                            line.substring(i + 1));
            }
        }

        info.contentType = (String) headers.get("content-type");
        headers.clear();
        out.close();
        in.close();
        if (socket != null) {
            socket.close();
        }
    }


    /**
     * Parses the content of a URL.
     *
     * @param currentPage      The URL information on the page to be parsed.
     * @param noticedLinks     The hashtable containing all links found.
     * @param unprocessedLinks The vector containing links that haven't
     *                         been processed yet.
     */
    protected void parseContent(URLInfo currentPage, Hashtable noticedLinks,
                                Vector unprocessedLinks)
            throws IOException {
        String thisline;
        int thisindex = 0;
        int tmpindex;
        //DataInputStream in = null;
        BufferedReader in = null;

        try {
            in = new BufferedReader(new InputStreamReader(currentPage.url.openStream()));
        } catch (Exception e) {
            return;
        }

        while ((thisline = in.readLine()) != null) {
            while (((tmpindex = thisline.toLowerCase().indexOf("href=",
                                                               thisindex + 1)) != -1) && (thisindex != -1)) {
                checkHref(currentPage, noticedLinks, unprocessedLinks,
                          thisline, tmpindex);
                thisindex = tmpindex;
            }
            thisindex = 0;
            while (((tmpindex = thisline.toLowerCase().indexOf("img src=", thisindex + 1)) != -1) && (thisindex != -1)) {
                checkSrc(currentPage, noticedLinks, unprocessedLinks, thisline,
                         tmpindex);
                thisindex = tmpindex;
            }
            thisindex = 0;
            while (((tmpindex = thisline.toLowerCase().indexOf("background=", thisindex + 1)) != -1) &&
                   (thisindex != -1)) {
                checkBg(currentPage, noticedLinks, unprocessedLinks, thisline,
                        tmpindex);
                thisindex = tmpindex;
            }
            thisindex = 0;
        }
        if (in != null) {
            in.close();
        }
    }


    /**
     * Looks for occurences of href=, and
     * adds the URL's referenced to the noticedLinks hashtable and the
     * unprocessedLinks vector.
     *
     * @param currentPage      The URL information on the page to be parsed.
     * @param noticedLinks     The hashtable containing all links found.
     * @param unprocessedLinks The vector containing links that haven't
     *                         been processed yet.
     * @param thisline         The current line.
     * @param tmpindex         The index of the occurence
     */
    protected void checkHref(URLInfo currentPage, Hashtable noticedLinks,
                             Vector unprocessedLinks, String thisline,
                             int tmpindex) {
        int i;
        String thisurl, tmpurl;
        String lasturl = currentPage.url.toString();


        i = thisline.toLowerCase().indexOf("mailto:");
        if ((i < tmpindex) || (i > tmpindex + 10)) {
            thisurl = thisline.substring(tmpindex + 6,
                                         thisline.indexOf(34, tmpindex + 6));
            if (thisurl.indexOf(currentPage.url.getHost()) == -1 &&
                thisurl.indexOf(":/") == -1) {
                if (thisurl.startsWith("/")) {
                    tmpurl = lasturl.substring(0, lasturl.indexOf("/",
                                                                  lasturl.indexOf(currentPage.url.getHost())));
                    thisurl = tmpurl.concat(thisurl);
                } else if (thisurl.startsWith("#")) {
                    thisurl = lasturl.concat(thisurl);
                } else {
                    tmpurl = lasturl.substring(0, lasturl.lastIndexOf("/") + 1);
                    thisurl = tmpurl.concat(thisurl);
                }
            }
            try {
                URL posurl = new URL(thisurl);
                enterURL(posurl, currentPage, noticedLinks, unprocessedLinks);
            } catch (Exception e) {
            }
        }
        thisurl = null;
        tmpurl = null;
        lasturl = null;
    }


    /**
     * Looks for occurences of img src=, and
     * adds the URL's referenced to the noticedLinks hashtable and the
     * unprocessedLinks vector.
     *
     * @param currentPage      The URL information on the page to be parsed.
     * @param noticedLinks     The hashtable containing all links found.
     * @param unprocessedLinks The vector containing links that haven't
     *                         been processed yet.
     * @param thisline         The current line.
     * @param tmpindex         The index of the occurence
     */
    protected void checkSrc(URLInfo currentPage, Hashtable noticedLinks,
                            Vector unprocessedLinks, String thisline,
                            int tmpindex) {
        int i;
        String thisurl, tmpurl;
        String lasturl = currentPage.url.toString();

        thisurl = thisline.substring(tmpindex + 9,
                                     thisline.indexOf(34, tmpindex + 9));
        if (thisurl.indexOf(currentPage.url.getHost()) == -1 &&
            thisurl.indexOf(":/") == -1) {
            if (thisurl.startsWith("/")) {
                tmpurl = lasturl.substring(0, lasturl.indexOf("/",
                                                              lasturl.indexOf(currentPage.url.getHost())));
                thisurl = tmpurl.concat(thisurl);
            } else if (thisurl.startsWith("#")) {
                thisurl = lasturl.concat(thisurl);
            } else {
                tmpurl = lasturl.substring(0, lasturl.lastIndexOf("/") + 1);
                thisurl = tmpurl.concat(thisurl);
            }
        }
        try {
            URL posurl = new URL(thisurl);
            enterURL(posurl, currentPage, noticedLinks, unprocessedLinks);
        } catch (Exception e) {
        }
        thisurl = null;
        tmpurl = null;
        lasturl = null;
    }


    /**
     * Looks for occurences of background=, and
     * adds the URL's referenced to the noticedLinks hashtable and the
     * unprocessedLinks vector.
     *
     * @param currentPage      The URL information on the page to be parsed.
     * @param noticedLinks     The hashtable containing all links found.
     * @param unprocessedLinks The vector containing links that haven't
     *                         been processed yet.
     */
    protected void checkBg(URLInfo currentPage, Hashtable noticedLinks,
                           Vector unprocessedLinks, String thisline,
                           int tmpindex) {
        int i;
        String thisurl, tmpurl;
        String lasturl = currentPage.url.toString();

        thisurl = thisline.substring(tmpindex + 12,
                                     thisline.indexOf(34, tmpindex + 12));
        if (thisurl.indexOf(currentPage.url.getHost()) == -1 &&
            thisurl.indexOf(":/") == -1) {
            if (thisurl.startsWith("/")) {
                tmpurl = lasturl.substring(0, lasturl.indexOf("/",
                                                              lasturl.indexOf(currentPage.url.getHost())));
                thisurl = tmpurl.concat(thisurl);
            } else if (thisurl.startsWith("#")) {
                thisurl = lasturl.concat(thisurl);
            } else {
                tmpurl = lasturl.substring(0, lasturl.lastIndexOf("/") + 1);
                thisurl = tmpurl.concat(thisurl);
            }
        }
        try {
            URL posurl = new URL(thisurl);
            enterURL(posurl, currentPage, noticedLinks, unprocessedLinks);
        } catch (Exception e) {
        }
        thisurl = null;
        tmpurl = null;
        lasturl = null;
    }


    /**
     * Checks if a URL is in the list of known URL's, and if it's not, adds
     * it to the list.
     *
     * @param posurl           The URL to be tested.
     * @param currentPage      The URL information on the URL that refers to posurl
     * @param noticedLinks     The hashtable containing all links found.
     * @param unprocessedLinks The vector containing links that haven't
     *                         been processed yet.
     */
    protected void enterURL(URL posurl, URLInfo currentPage,
                            Hashtable noticedLinks,
                            Vector unprocessedLinks)
            throws IOException {
        URLInfo tmp;

        if (noticedLinks.containsKey(posurl)) {
            tmp = (URLInfo) noticedLinks.get(posurl);
            noticedLinks.remove(posurl);
            tmp.referers = new Vector();
            tmp.referers.addElement(currentPage.url);
            noticedLinks.put(posurl, tmp);
        } else {
            tmp = new URLInfo();
            tmp.url = posurl;
            tmp.referers = new Vector();
            tmp.referers.addElement(currentPage.url);
            tmp.depth = currentPage.depth + 1;
            noticedLinks.put(tmp.url, tmp);
            unprocessedLinks.addElement(tmp);
        }
    }


    /**
     * Outputs the link information by the return code of the header.
     *
     * @param out          The stream to which to write the link information.
     * @param noticedLinks The hashtable containing all links found.
     */
    protected void sendResponse(ServletOutputStream out,
                                Hashtable noticedLinks)
            throws IOException {

        Vector notLocal = new Vector();
        Vector successful = new Vector(100);
        Vector redirectPermanent = new Vector(10);
        Vector redirectTemporary = new Vector(10);
        Vector badRequest = new Vector();
        Vector unauthorized = new Vector(10);
        Vector forbidden = new Vector(10);
        Vector notFound = new Vector(50);
        Vector internalError = new Vector(10);
        Vector badGateway = new Vector();
        Vector unavailable = new Vector(10);
        Vector unknown = new Vector();

        URLInfo link;
        int total = 0;

        Enumeration links = noticedLinks.elements();

        while (links.hasMoreElements()) {
            link = (URLInfo) links.nextElement();
            switch (link.statusCode) {
                case 1:
                    notLocal.addElement(link);
                    total++;
                    break;
                case 200:
                    successful.addElement(link);
                    break;
                case 301:
                    redirectPermanent.addElement(link);
                    total++;
                    break;
                case 302:
                    redirectTemporary.addElement(link);
                    total++;
                    break;
                case 400:
                    badRequest.addElement(link);
                    total++;
                    break;
                case 401:
                    unauthorized.addElement(link);
                    total++;
                    break;
                case 403:
                    forbidden.addElement(link);
                    total++;
                    break;
                case 404:
                    notFound.addElement(link);
                    total++;
                    break;
                case 500:
                    internalError.addElement(link);
                    total++;
                    break;
                case 502:
                    badGateway.addElement(link);
                    total++;
                    break;
                case 503:
                    unavailable.addElement(link);
                    total++;
                    break;
                default:
                    unknown.addElement(link);
                    total++;
                    break;
            }
        }

        out.println("<html><head><title>JavaServer Link Checker Results" +
                    "</title></head>");
        out.println("<body bgcolor=\"#eeeeff\"><center>" +
                    "<img src=\"/system/images/banner.gif\">");
        out.println("<h1>Link Checker Results</h1></center>");
        out.println("Total links checked: " + (successful.size() + total) +
                    "<br>");
        out.println("Successful links: " + successful.size() + "<br>");
        out.println("Unsuccessful links: " + total + "<p>");
        out.println("Not Found: " + notFound.size() + "<br>");
        printTextLinksAndReferers(notFound.elements(), out);
        out.println("Forbidden: " + forbidden.size() + "<br>");
        printTextLinksAndReferers(forbidden.elements(), out);
        out.println("Unauthorized: " + unauthorized.size() + "<br>");
        printTextLinksAndReferers(unauthorized.elements(), out);
        out.println("Server Internal Error: " + internalError.size() + "<br>");
        printTextLinksAndReferers(internalError.elements(), out);
        out.println("Bad Gateway: " + badGateway.size() + "<br>");
        printTextLinksAndReferers(badGateway.elements(), out);
        out.println("Unavailable: " + unavailable.size() + "<br>");
        printTextLinksAndReferers(unavailable.elements(), out);
        out.println("Temporarily Moved: " + redirectTemporary.size() + "<br>");
        printTextLinksAndReferers(redirectTemporary.elements(), out);
        out.println("Permanently Moved: " + redirectPermanent.size() + "<br>");
        printTextLinksAndReferers(redirectPermanent.elements(), out);
        out.println("Not Local: " + notLocal.size() + "<br>");
        printTextLinksAndReferers(notLocal.elements(), out);
        out.println("Check failed on: " + unknown.size() + "<br>");
        printTextLinksAndReferers(unknown.elements(), out);
        out.println("</body></html>");

    }


    /**
     * Prints a series and Links and their referers
     *
     * @param links An Enumeration of the links to print.
     * @param out   The stream to which to write the link information.
     */
    protected void printTextLinksAndReferers(Enumeration links,
                                             ServletOutputStream out)
            throws IOException {
        Enumeration urls;
        URL url;
        URLInfo link;

        out.println("<ul>");
        while (links.hasMoreElements()) {
            link = (URLInfo) links.nextElement();
            out.println("<li>" + link.url.toString());
            out.println("<dd>Linked from:");
            if (link.referers == null) {
                break;
            }

            urls = link.referers.elements();
            if (urls == null) {
                break;
            }

            while (urls.hasMoreElements()) {
                url = (URL) urls.nextElement();
                out.println("<b><a href=" + url.toString() + ">" + url.toString() +
                            "</a></b>");
            }
        }
        out.println("</ul>");
    }


    public String getServletInfo() {
        return "This is a Jeeves link checker.";
    }

}

/**
 * An auxillary class which holds information related
 * to a link.
 */
class URLInfo {
    URL url;
    int statusCode;
    String reasonPhrase;
    String contentType;
    Vector referers;
    int depth;
}




