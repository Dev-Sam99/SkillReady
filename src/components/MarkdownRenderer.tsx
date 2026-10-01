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
          className="bg-[#EEF3E8] border border-[#D9E4D0] text-[#2F5D3A] px-1.5 py-0.5 rounded-md font-mono text-[0.9em] font-semibold"
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
      <div className="relative my-3 rounded-[16px] overflow-hidden border border-[#D9E4D0] bg-white group shadow-subtle">
        <div className="bg-[#EEF3E8] px-4 py-2 flex items-center justify-between border-b border-[#D9E4D0]">
          <span className="text-xs font-mono text-[#566656] font-semibold uppercase tracking-wider">
            {match ? match[1] : 'code'}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#566656] hover:text-[#1F2D1F] transition-colors p-1 rounded-lg hover:bg-white cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#2E8B57]" aria-hidden="true" />
                <span className="text-[#2E8B57] font-sans text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#2F5D3A]" aria-hidden="true" />
                <span className="font-sans text-xs">Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm font-mono bg-white text-[#1F2D1F] m-0 leading-relaxed">
          <code className={codeClassName} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  };

  return (
    <div className={`prose prose-slate max-w-none text-sm sm:text-base leading-relaxed ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: CodeBlock,
          p({ children }) {
            return <p className="mb-2.5 last:mb-0 text-[#1F2D1F] font-normal">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 my-2 space-y-1 text-[#1F2D1F]">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 my-2 space-y-1 text-[#1F2D1F]">{children}</ol>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
