import type { FC, ReactNode } from "react";

interface ICodePreviewProps {
  code: string;
}

const keywords = new Set([
  "public", "private", "protected", "static", "final", "class", "interface", "enum", "record", "struct",
  "void", "int", "double", "float", "char", "bool", "boolean", "string", "long", "var", "val", "let", "const",
  "fun", "func", "def", "return", "if", "else", "elif", "for", "while", "do", "switch", "case", "break",
  "continue", "new", "this", "self", "true", "false", "null", "None", "True", "False", "nil", "try", "catch",
  "finally", "throw", "throws", "async", "await", "import", "export", "default", "from", "in", "is", "as",
  "override", "extends", "implements", "namespace", "using", "struct", "typedef", "lambda", "print",
]);

// Én regex som finner kommentarer, tekststrenger, tall og ord
const tokenPattern = /(\/\/.*$|#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b)/g;

// Enkel fargelegging av koden – nok til at den ser ut som i en editor
const highlightLine = (line: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push(line.slice(lastIndex, index));

    let className = "";
    if (token.startsWith("//") || token.startsWith("#")) className = "text-fog/40 italic";
    else if (token.startsWith('"') || token.startsWith("'")) className = "text-[#e6c07b]";
    else if (/^\d/.test(token)) className = "text-[#f2a07b]";
    else if (keywords.has(token)) className = "text-[#93a8ff]";
    else if (/^[A-Z]/.test(token)) className = "text-[#7fd1b9]";

    parts.push(className ? <span key={index} className={className}>{token}</span> : token);
    lastIndex = index + token.length;
  }

  if (lastIndex < line.length) parts.push(line.slice(lastIndex));
  return parts;
};

const CodePreview: FC<ICodePreviewProps> = ({ code }) => {
  const lines = code.split("\n");

  return (
    <pre className="m-0 overflow-hidden font-mono text-[12px] md:text-[12.5px] leading-[1.7] text-fog/85">
      <code>
        {lines.map((line, index) => (
          <div key={index} className="flex">
            <span className="w-8 shrink-0 select-none pr-3 text-right text-fog/25">{index + 1}</span>
            <span className="whitespace-pre">{highlightLine(line)}</span>
          </div>
        ))}
      </code>
    </pre>
  );
};

export default CodePreview;
