import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, MessageSquare, User, Share, Mail } from 'lucide-react';
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

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
};

const InterviewRoom = () => {
  const { roomId } = useParams();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [userName, setUserName] = useState('You (Host)');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('participant');
  
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
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex">
        {/* Video call area */}
        <div className={`flex-grow p-4 ${isChatOpen ? 'md:w-2/3' : 'w-full'}`}>
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
      </main>
    </div>
  );
};

export default InterviewRoom;
