
import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Play } from 'lucide-react';

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
  const [isRunning, setIsRunning] = useState(false);

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

  // Function to run code
  const runCode = () => {
    if (!editorRef.current) return;
    
    setIsRunning(true);

    // Get current code
    const codeToRun = editorRef.current.getValue();
    
    // Simulate code execution with a delay
    setTimeout(() => {
      setIsRunning(false);
      
      // Display output message
      let outputMessage = "Code execution is not implemented yet. This is a simulated response.";
      
      // Add language-specific messages for better UX
      if (language.toLowerCase() === 'javascript') {
        outputMessage = "JavaScript code execution would happen here. In a real implementation, we could use a secure sandbox to run JavaScript.";
      } else if (language.toLowerCase() === 'python') {
        outputMessage = "Python code execution would happen here. In a real implementation, this would connect to a Python interpreter API.";
      } else if (language.toLowerCase() === 'java') {
        outputMessage = "Java code execution would happen here. In a real implementation, this would compile and run Java code.";
      }
      
      // Show output in toast
      toast.info(`Execution Output (${language})`, {
        description: outputMessage,
        duration: 4000
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden" style={{ width, height }}>
      <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
        <div className="text-sm">{language.toUpperCase()}</div>
        {!readOnly && (
          <Button 
            onClick={runCode} 
            size="sm" 
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className="h-4 w-4 mr-1" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        )}
      </div>
      <div className="flex-grow">
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
    </div>
  );
};

export default CodeEditor;
