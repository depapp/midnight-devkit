import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Copy, Download, Upload, Check } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [compileStatus, setCompileStatus] = useState<'idle' | 'compiling' | 'success' | 'error'>('idle');
  const [compileOutput, setCompileOutput] = useState<string>('');
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Register Compact language for syntax highlighting
    monaco.languages.register({ id: 'compact' });
    
    // Define tokens for Compact language
    monaco.languages.setMonarchTokensProvider('compact', {
      keywords: [
        'contract', 'export', 'function', 'secret', 'public', 
        'Field', 'Bool', 'Void', 'Proof', 'let', 'return',
        'if', 'else', 'for', 'while', 'import', 'struct'
      ],
      
      operators: [
        '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
        '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
        '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
        '%=', '<<=', '>>=', '>>>='
      ],
      
      tokenizer: {
        root: [
          // Comments
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],
          
          // Keywords
          [/\b(contract|export|function|secret|public|Field|Bool|Void|Proof|let|return|if|else|for|while|import|struct)\b/, 'keyword'],
          
          // Numbers
          [/\b\d+\b/, 'number'],
          
          // Strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],
          
          // Identifiers
          [/[a-zA-Z_]\w*/, 'identifier'],
          
          // Operators
          [/[{}()\[\]]/, '@brackets'],
          [/[<>](?!@symbols)/, '@brackets'],
          [/@symbols/, {
            cases: {
              '@operators': 'operator',
              '@default': ''
            }
          }],
        ],
        
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],
        
        string: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape.invalid'],
          [/"/, 'string', '@pop']
        ],
      },
    });
    
    // Set theme colors for Compact
    monaco.editor.defineTheme('midnight-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'a855f7' },
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'string', foreground: '10b981' },
        { token: 'number', foreground: 'f59e0b' },
        { token: 'operator', foreground: '3b82f6' },
      ],
      colors: {
        'editor.background': '#1f2937',
        'editor.foreground': '#e5e7eb',
        'editor.lineHighlightBackground': '#374151',
        'editorCursor.foreground': '#a855f7',
        'editor.selectionBackground': '#4b5563',
      },
    });
    
    monaco.editor.setTheme('midnight-dark');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompile = async () => {
    setCompileStatus('compiling');
    setCompileOutput('Compiling contract...');
    
    // Simulate compilation
    setTimeout(() => {
      const hasError = Math.random() > 0.7; // 30% chance of error for demo
      
      if (hasError) {
        setCompileStatus('error');
        setCompileOutput(`Error: Unexpected token at line ${Math.floor(Math.random() * 20) + 1}
Please check your syntax and try again.`);
      } else {
        setCompileStatus('success');
        setCompileOutput(`✅ Compilation successful!
Generated proof circuit with:
- 3 public inputs
- 2 secret inputs
- 5 constraints
- Estimated proof generation time: 1.2s`);
      }
    }, 2000);
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contract.compact';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.compact,.txt';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          onChange(e.target.result);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-700 p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCompile}
              className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                compileStatus === 'compiling' 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : compileStatus === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : compileStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              disabled={compileStatus === 'compiling'}
            >
              <Play className="w-4 h-4" />
              <span>
                {compileStatus === 'compiling' ? 'Compiling...' : 'Compile'}
              </span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleImport}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="compact"
            language="compact"
            value={code}
            onChange={(value) => onChange(value || '')}
            onMount={handleEditorDidMount}
            theme="midnight-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              rulers: [80],
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              renderWhitespace: 'selection',
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              bracketPairColorization: {
                enabled: true,
              },
            }}
          />
        </div>
        
        {/* Output Panel */}
        <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300">Compiler Output</h3>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <pre className={`text-xs font-mono ${
              compileStatus === 'error' ? 'text-red-400' : 
              compileStatus === 'success' ? 'text-green-400' : 
              'text-gray-400'
            }`}>
              {compileOutput || 'Click "Compile" to see output'}
            </pre>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-700 px-4 py-2 border-t border-gray-600 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Compact Language</span>
          <span>UTF-8</span>
          <span>Lines: {code.split('\n').length}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`flex items-center space-x-1 ${
            compileStatus === 'success' ? 'text-green-400' :
            compileStatus === 'error' ? 'text-red-400' :
            compileStatus === 'compiling' ? 'text-yellow-400' :
            'text-gray-400'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>
              {compileStatus === 'idle' ? 'Ready' :
               compileStatus === 'compiling' ? 'Compiling...' :
               compileStatus === 'success' ? 'Compiled' :
               'Error'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
