import React from "react";

type InlineCodeProps = React.PropsWithChildren<{
  children: React.ReactNode;
}>;

const InlineCode: React.FC<InlineCodeProps> = ({ children }) => (
  <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">
    {children}
  </code>
);

export default React.memo(InlineCode);
