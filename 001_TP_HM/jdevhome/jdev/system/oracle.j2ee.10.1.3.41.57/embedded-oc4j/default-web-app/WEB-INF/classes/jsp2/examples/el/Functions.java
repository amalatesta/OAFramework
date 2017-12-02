/*
* Copyright 2004 The Apache Software Foundation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
package jsp2.examples.el;

import java.util.*;

/**
 * Defines the functions for the jsp2 example tag library.
 * <p/>
 * <p>Each function is defined as a static method.</p>
 */
public class Functions {
    public static String reverse(String text) {
        return new StringBuffer(text).reverse().toString();
    }


    public static int numVowels(String text) {
        String vowels = "aeiouAEIOU";
        int result = 0;
        for (int i = 0; i < text.length(); i++) {
            if (vowels.indexOf(text.charAt(i)) != -1) {
                result++;
            }
        }
        return result;
    }


    public static String caps(String text) {
        return text.toUpperCase();
    }


    public static String htmlReplace(String input) {
        if (input == null) {
            return null;
        }

        StringBuffer output = new StringBuffer();
        char current;

        for (int i = 0; i < input.length(); i++) {
            current = input.charAt(i);
            switch (current) {
                case '<':
                    output.append("&lt;");
                    break;
                case '>':
                    output.append("&gt;");
                    break;
                case '&':
                    output.append("&amp;");
                    break;
                case '\"':
                    output.append("&quot;");
                    break;
                default  :
                    output.append(current);
                    break;
            }
        }

        return output.toString();
    }


}
