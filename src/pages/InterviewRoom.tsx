import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, MessageSquare, User, Share, Mail, Code, FileCode } from 'lucide-react';
import { toast } from "sonner";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from '@/components/CodeEditor';

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
};

type CodeQuestion = {
  id: string;
  question: string;
  language: string;
  timestamp: Date;
};

type CodeAnswer = {
  id: string;
  questionId: string;
  code: string;
  language: string;
  timestamp: Date;
};

const InterviewRoom = () => {
  const { roomId } = useParams();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [userName, setUserName] = useState('You (Host)');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('participant');
  const [currentTab, setCurrentTab] = useState('video');
  
  // Code editor states
  const [codeQuestions, setCodeQuestions] = useState<CodeQuestion[]>([]);
  const [codeAnswers, setCodeAnswers] = useState<CodeAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const [currentCode, setCurrentCode] = useState('// Start coding here...');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [isHost, setIsHost] = useState(true);
  
  // Simulate participants (in a real app this would come from a real-time connection)
  const [participants, setParticipants] = useState([
    { id: 'user1', name: 'You (Host)', isHost: true },
    { id: 'user2', name: 'Candidate', isHost: false },
  ]);

  // Generate meeting link
  const meetingLink = window.location.href;

  // Initialize media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        
        // Connect the stream to video element
        const videoElement = document.getElementById('localVideo') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast.error('Could not access camera or microphone');
        setIsVideoEnabled(false);
        setIsAudioEnabled(false);
      }
    };

    initializeMedia();
    
    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Toggle chat sidebar
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setIsCodeEditorOpen(false);
    }
  };

  // Toggle code editor sidebar
  const toggleCodeEditor = () => {
    setIsCodeEditorOpen(!isCodeEditorOpen);
    if (!isCodeEditorOpen) {
      setIsChatOpen(false);
    }
  };

  // Send a message
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: userName,
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setCurrentMessage('');
    
    // Simulate received message (in a real app this would be from WebRTC or a chat server)
    setTimeout(() => {
      if (Math.random() > 0.5) {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'Candidate',
          content: 'Thanks for the question. Let me think about that...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
      }
    }, 3000);
  };

  // Add a code question (for host)
  const addCodeQuestion = () => {
    if (!currentQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    const newQuestion: CodeQuestion = {
      id: Date.now().toString(),
      question: currentQuestion,
      language: currentLanguage,
      timestamp: new Date()
    };
    
    setCodeQuestions([...codeQuestions, newQuestion]);
    setCurrentQuestion('');
    
    // Send a message about the code question
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: userName,
      content: `💻 New coding question (${currentLanguage}): ${currentQuestion}`,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    
    // Toast notification
    toast.success("Code question sent to candidate");
  };

  // Submit code answer (for candidate)
  const submitCodeAnswer = () => {
    if (!selectedQuestionId) {
      toast.error("Please select a question to answer");
      return;
    }
    
    const newAnswer: CodeAnswer = {
      id: Date.now().toString(),
      questionId: selectedQuestionId,
      code: currentCode,
      language: currentLanguage,
      timestamp: new Date()
    };
    
    setCodeAnswers([...codeAnswers, newAnswer]);
    
    // Send a message about the code answer
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: userName,
      content: `💻 I've submitted my code solution`,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    
    // Toast notification
    toast.success("Code answer submitted");
  };

  // Copy meeting link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    toast.success("Meeting link copied to clipboard!");
  };

  // Send invitation email
  const sendInvitation = () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    // Simulate sending invitation
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-custom-purple">Live Interview Session</h1>
            <p className="text-gray-500">Room ID: {roomId}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Live
            </span>
            
            {/* Share Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share className="h-5 w-5" />
                  <span>Share</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Interview Session</DialogTitle>
                  <DialogDescription>
                    Invite others to join this interview session by sharing the link or sending an email.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center space-x-2 mt-4">
                  <div className="grid flex-1 gap-2">
                    <label className="text-sm font-medium">Meeting Link</label>
                    <Input
                      value={meetingLink}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <Button type="button" size="icon" onClick={copyLinkToClipboard}>
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4 mt-4">
                  <h4 className="text-sm font-medium">Invite by Email</h4>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Input
                        placeholder="Email address"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="w-[150px]">
                      <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                      >
                        <option value="participant">Participant</option>
                        <option value="interviewer">Co-Interviewer</option>
                      </select>
                    </div>
                    <Button type="button" onClick={sendInvitation}>
                      <Mail className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={toggleChat} className="relative">
              <MessageSquare className="h-5 w-5" />
              <span className="ml-2">Chat</span>
              {messages.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {messages.length}
                </span>
              )}
            </Button>
            
            <Button variant="outline" onClick={toggleCodeEditor} className="relative">
              <Code className="h-5 w-5" />
              <span className="ml-2">Code</span>
              {codeQuestions.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {codeQuestions.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex">
        {/* Main content area - Adjusted to ensure proper layout balance */}
        <div className={`flex-grow p-4 ${isChatOpen || isCodeEditorOpen ? 'md:w-2/3' : 'w-full'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Local video */}
            <div className="bg-black rounded-lg overflow-hidden relative aspect-video">
              <video
                id="localVideo"
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${isVideoEnabled ? '' : 'hidden'}`}
              ></video>
              
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <User className="h-20 w-20 text-gray-400" />
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg text-white">
                {userName}
              </div>
              
              {/* Video controls */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-full ${isVideoEnabled ? 'bg-gray-700' : 'bg-red-600'}`}
                >
                  {isVideoEnabled ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
                </button>
                <button
                  onClick={toggleAudio}
                  className={`p-2 rounded-full ${isAudioEnabled ? 'bg-gray-700' : 'bg-red-600'}`}
                >
                  {isAudioEnabled ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-white" />}
                </button>
              </div>
            </div>
            
            {/* Remote video (candidate) - in a real app this would be connected via WebRTC */}
            <div className="bg-black rounded-lg overflow-hidden relative aspect-video">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <User className="h-20 w-20 text-gray-400" />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg text-white">
                  Candidate
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat sidebar */}
        {isChatOpen && (
          <div className="w-full md:w-1/3 bg-white border-l border-gray-200 flex flex-col h-[calc(100vh-64px)]">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">Interview Chat</h2>
            </div>
            
            {/* Messages area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex flex-col ${message.sender === userName ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="text-xs text-gray-500">
                        {message.sender} • {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === userName 
                          ? 'bg-custom-purple text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button onClick={sendMessage} className="bg-custom-purple hover:bg-custom-purple-dark">
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Code Editor sidebar - Improved positioning */}
        {isCodeEditorOpen && (
          <div className="w-full md:w-1/3 bg-white border-l border-gray-200 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">Coding Interview</h2>
            </div>
            
            <Tabs defaultValue={isHost ? "question" : "answer"} className="flex flex-col flex-grow overflow-hidden">
              <TabsList className="grid w-full grid-cols-2">
                {isHost && <TabsTrigger value="question">Create Question</TabsTrigger>}
                <TabsTrigger value="answer" className={isHost ? "" : "col-span-2"}>
                  {isHost ? "View Answers" : "Answer Question"}
                </TabsTrigger>
              </TabsList>
              
              {/* Question Tab - Only for Host */}
              {isHost && (
                <TabsContent value="question" className="space-y-4 pt-4 overflow-y-auto flex-grow">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Programming Language</label>
                    <select 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={currentLanguage}
                      onChange={(e) => setCurrentLanguage(e.target.value)}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="csharp">C#</option>
                      <option value="cpp">C++</option>
                      <option value="php">PHP</option>
                      <option value="ruby">Ruby</option>
                      <option value="go">Go</option>
                      <option value="swift">Swift</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question</label>
                    <Textarea
                      placeholder="Enter a coding question..."
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      className="resize-none min-h-[120px]"
                    />
                  </div>
                  
                  <Button 
                    onClick={addCodeQuestion} 
                    className="w-full bg-custom-purple hover:bg-custom-purple-dark"
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    Send Question
                  </Button>
                  
                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-2">Previous Questions</h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {codeQuestions.length === 0 ? (
                        <p className="text-sm text-gray-500">No questions yet</p>
                      ) : (
                        codeQuestions.map(q => (
                          <div key={q.id} className="p-3 bg-gray-50 rounded border">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {q.language}
                              </span>
                              <span className="text-xs text-gray-500">
                                {q.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <p className="text-sm mt-2">{q.question}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {/* Answer Tab - For all participants - Fixed layout */}
              <TabsContent value="answer" className="space-y-4 pt-4 overflow-y-auto flex-grow">
                {!isHost && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Question</label>
                    <select 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedQuestionId}
                      onChange={(e) => {
                        setSelectedQuestionId(e.target.value);
                        const question = codeQuestions.find(q => q.id === e.target.value);
                        if (question) {
                          setCurrentLanguage(question.language);
                        }
                      }}
                    >
                      <option value="">-- Select a question --</option>
                      {codeQuestions.map(q => (
                        <option key={q.id} value={q.id}>
                          {q.question.substring(0, 50)}...
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {(selectedQuestionId || isHost) && (
                  <>
                    <div className="border rounded-lg overflow-hidden h-[350px]">
                      <CodeEditor
                        language={currentLanguage}
                        value={currentCode}
                        onChange={setCurrentCode}
                        readOnly={false}
                        height="100%"
                        width="100%"
                      />
                    </div>
                    
                    {!isHost && (
                      <Button 
                        onClick={submitCodeAnswer} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Submit Solution
                      </Button>
                    )}
                    
                    {isHost && codeAnswers.length > 0 && (
                      <div className="mt-4 overflow-y-auto max-h-[200px]">
                        <h3 className="text-sm font-medium mb-2">Candidate Solutions</h3>
                        <div className="space-y-2">
                          {codeAnswers.map(answer => {
                            const question = codeQuestions.find(q => q.id === answer.questionId);
                            return (
                              <div key={answer.id} className="p-3 bg-gray-50 rounded border">
                                <div className="flex justify-between items-start">
                                  <span className="text-xs font-medium text-blue-600">
                                    Question: {question ? question.question.substring(0, 30) + '...' : 'Unknown'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {answer.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                </div>
                                <div className="mt-2 p-2 bg-gray-800 text-white rounded overflow-x-auto text-sm">
                                  <pre><code>{answer.code}</code></pre>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewRoom;
