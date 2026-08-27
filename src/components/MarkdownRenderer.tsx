'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const CodeBlock = ({ className: codeClassName, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(codeClassName || '');
    const codeString = String(children).replace(/\n$/, '');
    const isInline = !match && !codeString.includes('\n');

    if (isInline) {
      return (
        <code
          className="bg-[#f7f7f7] border border-stone-200 text-stone-800 px-1.5 py-0.5 rounded-md font-mono text-[0.85em]"
          {...props}
        >
          {children}
        </code>
      );
    }

    const handleCopy = () => {
      navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative my-3 rounded-md overflow-hidden border border-stone-200/80 bg-[#f7f7f7] group">
        <div className="bg-stone-200/60 px-3 py-1.5 flex items-center justify-between border-b border-stone-200/60">
          <span className="text-[10px] font-mono text-stone-500 font-medium uppercase tracking-wider">
            {match ? match[1] : 'code'}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-mono text-stone-500 hover:text-stone-900 transition-colors p-1 rounded hover:bg-stone-300/50"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-sans text-[10px]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="font-sans text-[10px]">Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-3.5 overflow-x-auto text-xs font-mono bg-[#f7f7f7] text-stone-900 m-0 leading-relaxed">
          <code className={codeClassName} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  };

  return (
    <div className={`prose prose-stone max-w-none text-xs md:text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: CodeBlock,
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
