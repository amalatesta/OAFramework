
class DemoUtil {
    // List of mappings.  The first element is the original HTML special
    // character, and the second the replacement string.
    static public String[][] mappings =
            {{"<", "&lt;"},
             {">", "&gt;"},
             {"&", "&amp;"},
             {"\"", "&quot;"}};


    /**
     * HTMLReplace()
     * Returns the input string with any HTML special characters replaced by
     * their mnemonic equivalents.
     *
     * @param input Input string
     * @return Input with characters replaced
     */
    static public String HTMLReplace(String input) {
        if (input == null) {
            return null;
        }

        StringBuffer output = new StringBuffer();

        // Loop over the input string
        for (int i = 0; i < input.length(); i++) {
            boolean replaced = false;
            String current = input.substring(i, i + 1);

            // For each character in the input, loop through the mappings
            for (int j = 0; j < mappings.length; j++) {
                // and replace if necessary
                if (current.equalsIgnoreCase(mappings[j][0])) {
                    replaced = true;
                    output = output.append(mappings[j][1]);
                    break;
                }
            }
            if (!replaced) {
                output.append(current);
            }
        }

        return new String(output);
    }
}

