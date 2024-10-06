import React, { useState } from 'react';
import { js_beautify, html, css } from 'js-beautify';
import { format } from 'sql-formatter';
import jsonBeautify from 'json-beautify';
import { saveAs } from 'file-saver';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html as htmlLang } from '@codemirror/lang-html';
import { css as cssLang } from '@codemirror/lang-css';
import { json as jsonLang } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

const CodeBeautifier: React.FC = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState('');

  const handleBeautify = () => {
    let beautifiedCode = '';
    try {
      if (language === 'javascript') {
        beautifiedCode = js_beautify(inputCode, { indent_size: indentSize });
      } else if (language === 'html') {
        beautifiedCode = html(inputCode, { indent_size: indentSize });
      } else if (language === 'css') {
        beautifiedCode = css(inputCode, { indent_size: indentSize });
      } else if (language === 'json') {
        beautifiedCode = jsonBeautify(JSON.parse(inputCode), null as any, indentSize, 100);
      } else if (language === 'sql') {
        beautifiedCode = format(inputCode,  {
          language: 'mysql',
          tabWidth: indentSize,
          keywordCase: 'upper',
          linesBetweenQueries: 2,
        });
      }
      setOutputCode(beautifiedCode);
      setError('');
    } catch (error) {
      setOutputCode('');
      setError('Error beautifying code. Please check the input.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputCode(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleFileDownload = () => {
    const blob = new Blob([outputCode], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `beautified-code.${language}`);
  };

  const getMode = () => {
    if (language === 'javascript') return javascript();
    if (language === 'html') return htmlLang();
    if (language === 'css') return cssLang();
    if (language === 'json') return jsonLang();
    // For SQL, we can use javascript mode as there's no direct support
    if (language === 'sql') return javascript();
    return javascript(); // Default to JavaScript
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Code Beautifier</h1>
      <div className="mb-4">
        <label className="mr-2">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="sql">SQL</option>
        </select>
        <label className="ml-4 mr-2">Indent Size:</label>
        <input
          type="number"
          value={indentSize}
          onChange={(e) => setIndentSize(parseInt(e.target.value))}
          className="p-2 border rounded w-16"
        />
      </div>
      <div className="mb-4">
        <input type="file" onChange={handleFileUpload} className="mb-4" />
        <CodeMirror
          value={inputCode}
          extensions={[getMode()]}
          theme={oneDark}
          onChange={(value) => setInputCode(value)}
          height="200px"
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleBeautify}
      >
        Beautify Code
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        onClick={handleFileDownload}
      >
        Download Beautified Code
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Beautified Code</h2>
        <CodeMirror
          value={outputCode}
          extensions={[getMode()]}
          theme={oneDark}
          height="200px"
          readOnly
        />
      </div>
    </div>
  );
};

export default CodeBeautifier;
