import React, { useMemo, useState, useCallback } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import Anchor from 'markdown-it-anchor';
import TocDoneRight from 'markdown-it-toc-done-right';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/gradient-dark.css';
import './markdown.css';
import TocNav from './plugins/TocNav';

MarkdownEditor.use(TocNav);

// Initialize a markdown parser
const getMdParser = (renderToc) => {
  const mdParser = new MarkdownIt({
    highlight: function (str: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          // console.log(str);
          // console.log(hljs.highlight(lang, str).value);
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }
      return ''; // 使用额外的默认转义
    },
  })
    .use(Anchor)
    .use(TocDoneRight, {
      callback: renderToc,
    });
  return mdParser;
};

const MdEditor = ({ onChange, ...props }) => {
  const [toc, setToc] = useState(null);
  const renderToc = useCallback((html, ast) => {
    setTimeout(() => {
      const outlineEl = document.getElementById('rc-markdown-outline');
      console.log(outlineEl);
      if (outlineEl) {
        outlineEl.innerHTML = html;
      }
    });
    setToc(html);
  }, []);
  const mdParser = useMemo(() => getMdParser(renderToc), [renderToc]);

  return (
    <MarkdownEditor
      style={{ height: '100%' }}
      htmlClass="markdown-body"
      renderHTML={(text) => mdParser.render(text)}
      onChange={({ html, text }) => {
        onChange({ html, text, toc });
      }}
      {...props}
    />
  );
};

export default MdEditor;
