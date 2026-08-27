import { NextRequest, NextResponse } from 'next/server';
import { sql, isNeonConfigured } from '@/lib/db';
import { MOCK_QUESTIONS, MOCK_TOPICS } from '@/lib/mockData';
import { Question, Topic } from '@/types';

// Helper to split markdown text into prose vs code blocks for PDF/print formatting
function renderMarkdownHTML(text: string): string {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const firstLineEnd = part.indexOf('\n');
        let lang = 'code';
        let codeContent = part.slice(3, -3);
        if (firstLineEnd !== -1) {
          lang = part.slice(3, firstLineEnd).trim() || 'code';
          codeContent = part.slice(firstLineEnd + 1, -3);
        }
        const escapedCode = codeContent
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<div class="code-box">
          <div class="code-header">${lang}</div>
          <pre><code>${escapedCode}</code></pre>
        </div>`;
      }
      // Prose text with inline code spans
      const processedProse = part
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        .replace(/\n/g, '<br/>');
      return processedProse;
    })
    .join('');
}

export async function GET(request: NextRequest) {
  // Check admin session cookie server-side
  const adminCookie = request.cookies.get('skillready_admin_session');
  if (adminCookie?.value !== 'admin_authenticated_session') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required to export PDF' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const selectedTopicId = searchParams.get('topicId') || 'all';

  let questions = MOCK_QUESTIONS;
  let topics = MOCK_TOPICS;

  if (isNeonConfigured()) {
    try {
      const qRows = await sql`SELECT * FROM questions ORDER BY created_at DESC`;
      const tRows = await sql`SELECT * FROM topics ORDER BY name ASC`;
      questions = qRows as unknown as Question[];
      topics = tRows as unknown as Topic[];
    } catch (e) {
      console.error('Database query error in PDF export:', e);
    }
  }

  if (selectedTopicId !== 'all') {
    questions = questions.filter((q) => q.topic_id === selectedTopicId);
    topics = topics.filter((t) => t.id === selectedTopicId);
  }

  const dateStr = new Date().toISOString().split('T')[0];

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>SkillReady Technical Q&A Export - ${dateStr}</title>
        <style>
          @page { margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 30px; color: #1c1917; line-height: 1.6; }
          h1 { font-family: Georgia, serif; font-size: 26px; margin-bottom: 4px; color: #0c0a09; }
          .sub { font-family: monospace; font-size: 11px; color: #78716c; margin-bottom: 24px; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px; }
          .topic-group { margin-bottom: 28px; page-break-inside: avoid; }
          .topic-title { font-family: monospace; font-size: 13px; background: #f5f4ef; padding: 6px 12px; border-radius: 6px; font-weight: bold; margin-bottom: 14px; border: 1px solid #e7e5e4; text-transform: uppercase; letter-spacing: 0.5px; }
          .q-card { margin-bottom: 18px; padding-left: 12px; border-left: 3px solid #1c1917; page-break-inside: avoid; }
          .q-title { font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #0c0a09; }
          .q-ans { font-size: 12px; color: #292524; background: #fafaf8; padding: 12px; border-radius: 6px; border: 1px solid #e7e5e4; }
          .inline-code { font-family: "Courier New", Courier, monospace; background: #f4f4f0; padding: 2px 5px; border-radius: 4px; font-size: 0.9em; border: 1px solid #e2e0d8; }
          .code-box { background: #f7f7f7; border: 1px solid #e7e5e4; border-radius: 6px; margin: 10px 0; overflow: hidden; }
          .code-header { background: #e7e5e4; font-family: monospace; font-size: 10px; padding: 3px 10px; color: #57534e; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #d6d3d1; }
          pre { margin: 0; padding: 10px; font-family: "Courier New", Courier, monospace; font-size: 11px; white-space: pre-wrap; word-wrap: break-word; color: #1c1917; line-height: 1.4; }
        </style>
      </head>
      <body>
        <h1>SkillReady // Technical Q&A Guide</h1>
        <div class="sub">Exported on ${dateStr} • Spaced Repetition Reference Guide</div>

        ${topics.map(t => {
          const topicQs = questions.filter(q => q.topic_id === t.id);
          if (topicQs.length === 0) return '';
          return `
            <div class="topic-group">
              <div class="topic-title"># ${t.name} (${topicQs.length})</div>
              ${topicQs.map(q => `
                <div class="q-card">
                  <div class="q-title">Q: ${renderMarkdownHTML(q.question)}</div>
                  <div class="q-ans">${renderMarkdownHTML(q.answer)}</div>
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `inline; filename="skillready-export-${dateStr}.pdf"`,
    },
  });
}
