
import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  width?: string;
}

const CodeEditor = ({ 
  language, 
  value, 
  onChange, 
  readOnly = false,
  height = "400px",
  width = "100%" 
}: CodeEditorProps) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Focus the editor if it's not read-only
    if (!readOnly) {
      setTimeout(() => {
        editor.focus();
      }, 100);
    }
  };

  const handleChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  // Map language values to Monaco editor languages
  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'csharp': 'csharp',
      'cpp': 'cpp',
      'php': 'php',
      'ruby': 'ruby',
      'go': 'go',
      'swift': 'swift',
      // Add more languages as needed
    };
    
    return languageMap[lang.toLowerCase()] || 'plaintext';
  };

  return (
    <div className="w-full h-full" style={{ width, height }}>
      <Editor
        height="100%"
        width="100%"
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          readOnly,
          wordWrap: 'on',
          automaticLayout: true,
        }}
        onMount={handleEditorDidMount}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;
