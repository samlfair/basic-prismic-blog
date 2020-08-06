import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { paraisoLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeBlock = ({ slice }) => {
  return (
    <div className="code-block container">
      <SyntaxHighlighter
        language={slice.primary.language.toLowerCase}
        style={paraisoLight}
        showLineNumbers={!!slice.primary.starting_line_number}
        startingLineNumber={slice.primary.starting_line_number}
        lineNumberStyle={{ color: "white" }}
      >
        {slice.primary.code[0].text}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
