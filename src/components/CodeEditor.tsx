
import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Play } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      'c': 'c',
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
    setOutput([]);
    setError(null);

    // Get current code
    const codeToRun = editorRef.current.getValue();
    
    setTimeout(() => {
      setIsRunning(false);
      
      try {
        // For JavaScript, we can actually execute the code
        if (language.toLowerCase() === 'javascript') {
          // Create a sandbox to capture console.log output
          const originalConsoleLog = console.log;
          const logs: string[] = [];
          
          // Override console.log to capture outputs
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
          };
          
          // Execute the code
          try {
            // Use Function constructor to evaluate code
            const executeFn = new Function(codeToRun);
            executeFn();
            
            // Display the captured logs
            if (logs.length > 0) {
              setOutput(logs);
              toast.success(`Code executed successfully`, {
                description: logs.join('\n'),
                duration: 5000
              });
            } else {
              toast.info(`Code executed with no output`, {
                description: "Your code ran successfully but didn't output anything via console.log",
                duration: 3000
              });
            }
          } catch (execError) {
            setError(String(execError));
            toast.error(`Runtime Error`, {
              description: String(execError),
              duration: 5000
            });
          }
          
          // Restore the original console.log
          console.log = originalConsoleLog;
        } else {
          // For other languages, show a simulation message with appropriate feedback
          // This would be replaced with actual execution in a real backend implementation
          
          // Generate simulated output based on language
          let simulatedOutputs: string[] = [];
          let simulatedError: string | null = null;
          
          if (language.toLowerCase() === 'python') {
            if (codeToRun.includes('print(')) {
              // Extract content from print statements as simulated output
              const printMatches = codeToRun.match(/print\((.*?)\)/g) || [];
              simulatedOutputs = printMatches.map(match => {
                let content = match.substring(6, match.length - 1).trim();
                // Handle quotes in the print content
                if ((content.startsWith('"') && content.endsWith('"')) || 
                    (content.startsWith("'") && content.endsWith("'"))) {
                  content = content.substring(1, content.length - 1);
                }
                return content;
              });
            }
          } else if (language.toLowerCase() === 'java') {
            if (codeToRun.includes('System.out.println')) {
              // Extract content from println statements as simulated output
              const printlnMatches = codeToRun.match(/System\.out\.println\((.*?)\);/g) || [];
              simulatedOutputs = printlnMatches.map(match => {
                let content = match.substring(19, match.length - 2).trim();
                if ((content.startsWith('"') && content.endsWith('"')) || 
                    (content.startsWith("'") && content.endsWith("'"))) {
                  content = content.substring(1, content.length - 1);
                }
                return content;
              });
            }
            
            // Check for common Java compilation errors
            if (!codeToRun.includes('class') && codeToRun.includes('public static void main')) {
              simulatedError = "Error: Class declaration missing";
            }
          } else if (language.toLowerCase() === 'cpp' || language.toLowerCase() === 'c') {
            if (codeToRun.includes('cout <<') || codeToRun.includes('printf(')) {
              // Extract from cout or printf as simulated output
              const coutMatches = codeToRun.match(/cout\s*<<\s*(.*?)\s*;/g) || [];
              const printfMatches = codeToRun.match(/printf\((.*?)\);/g) || [];
              
              simulatedOutputs = [
                ...coutMatches.map(match => {
                  let content = match.replace(/cout\s*<<\s*/, '').replace(';', '').trim();
                  if ((content.startsWith('"') && content.endsWith('"')) || 
                      (content.startsWith("'") && content.endsWith("'"))) {
                    content = content.substring(1, content.length - 1);
                  }
                  return content;
                }),
                ...printfMatches.map(match => {
                  let content = match.substring(7, match.length - 2).trim();
                  if (content.startsWith('"') && content.includes('"')) {
                    content = content.substring(1, content.indexOf('"', 1));
                  }
                  return content;
                })
              ];
            }
            
            // Check for common C/C++ errors
            if (language.toLowerCase() === 'cpp' && !codeToRun.includes('#include')) {
              simulatedError = "Warning: Missing include directives";
            }
          }
          
          // Set simulated outputs if any were generated
          if (simulatedOutputs.length > 0) {
            setOutput(simulatedOutputs);
          } else {
            // Default output message if no simulation was possible
            setOutput([`[Simulated] Output would appear here when connected to a ${language} execution service`]);
          }
          
          // Set any simulated errors
          if (simulatedError) {
            setError(simulatedError);
          }
          
          // Show toast with simulation notice
          toast.info(`${language.toUpperCase()} Code Simulation`, {
            description: `Real ${language} execution requires a backend service. This is a simulation.`,
            duration: 4000
          });
        }
      } catch (error) {
        setError(String(error));
        toast.error("Error executing code", {
          description: String(error),
          duration: 5000
        });
      }
    }, 500);
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
      
      {error && (
        <div className="bg-red-900 text-red-100 p-3 border-t border-red-700 font-mono text-sm overflow-auto max-h-32">
          <div className="text-xs text-red-300 mb-1">Error:</div>
          <div>{error}</div>
        </div>
      )}
      
      {output.length > 0 && (
        <div className="bg-black text-green-400 p-3 border-t border-gray-700 font-mono text-sm overflow-auto max-h-32">
          <div className="text-xs text-gray-400 mb-1">Output:</div>
          {output.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
