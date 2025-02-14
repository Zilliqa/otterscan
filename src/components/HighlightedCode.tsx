import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, PropsWithChildren } from "react";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";
import { SyntaxHighlighter } from "../highlight-init.ts";

type HighlightedCodeProps = {
  language: string;
  content: string;
};

export const HighlightedCode: FC<PropsWithChildren<HighlightedCodeProps>> = ({
  language,
  content,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content ?? "");
  };
  return (
    <div className="relative">
      <SyntaxHighlighter language={language} style={docco} showLineNumbers>
        {content ?? ""}
      </SyntaxHighlighter>
      <button
        className="absolute top-2 right-2 border bg-skin-button-fill px-2 py-1 text-sm text-skin-button hover:bg-skin-button-hover-fill focus:outline-none"
        type="button"
        onClick={handleCopy}
        title="Copy to clipboard"
      >
        <FontAwesomeIcon icon={faCopy} />
      </button>
    </div>
  );
};

export default HighlightedCode;
