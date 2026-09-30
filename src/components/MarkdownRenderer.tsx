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
          className="bg-tint border border-line/80 text-deep px-1.5 py-0.5 rounded-md font-mono text-[0.9em] font-semibold"
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
      <div className="relative my-3 rounded-2xl overflow-hidden border border-line bg-white group shadow-2xs">
        <div className="bg-tint/60 px-4 py-2 flex items-center justify-between border-b border-line">
          <span className="text-xs font-mono text-slate font-semibold uppercase tracking-wider">
            {match ? match[1] : 'code'}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-ink transition-colors p-1 rounded-lg hover:bg-white"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#166534]" aria-hidden="true" />
                <span className="text-[#166534] font-sans text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-deep" aria-hidden="true" />
                <span className="font-sans text-xs">Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm font-mono bg-white text-ink m-0 leading-relaxed">
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
            return <p className="mb-2.5 last:mb-0 text-ink font-normal">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 my-2 space-y-1 text-ink">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 my-2 space-y-1 text-ink">{children}</ol>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
