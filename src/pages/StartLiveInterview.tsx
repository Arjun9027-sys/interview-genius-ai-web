
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Users, User, ArrowRight } from 'lucide-react';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StartLiveInterview = () => {
  const navigate = useNavigate();
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingType, setMeetingType] = useState('technical');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('participant');

  // Meeting type options
  const meetingTypes = [
    { id: 'technical', name: 'Technical Interview', description: 'Coding problems and system design' },
    { id: 'behavioral', name: 'Behavioral Interview', description: 'Soft skills and experience' },
    { id: 'case', name: 'Case Interview', description: 'Problem-solving scenarios' },
  ];

  // Generate a unique meeting ID
  const generateMeetingId = () => {
    return 'meet-' + Math.random().toString(36).substring(2, 10);
  };

  // Handle meeting creation
  const handleCreateMeeting = () => {
    if (!meetingTitle.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const meetingId = generateMeetingId();
      const generatedLink = `${window.location.origin}/live-interview/${meetingId}`;
      setMeetingLink(generatedLink);
      setShowDialog(true);
      setIsGenerating(false);
    }, 1500);
  };

  // Copy meeting link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    toast.success("Link copied to clipboard!");
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

  // Join the meeting as host
  const joinMeeting = () => {
    toast.success("Starting interview session...");
    // In a real implementation, this would redirect to the actual meeting room
    // with proper authentication as the host
    setTimeout(() => {
      navigate(`/live-interview`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-custom-blue-soft">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Start a Live Interview</h1>
              <p className="text-xl text-gray-600 mb-8">
                Create your interview session and invite participants to join you in real-time.
              </p>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Interview Session Details</CardTitle>
                  <CardDescription>Set up your meeting information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="meetingTitle" className="block text-sm font-medium mb-1">
                      Meeting Title
                    </label>
                    <Input
                      id="meetingTitle"
                      placeholder="e.g. Frontend Developer Interview"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Interview Type</label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {meetingTypes.map((type) => (
                        <div 
                          key={type.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            meetingType === type.id 
                              ? 'border-custom-purple bg-custom-purple/10' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setMeetingType(type.id)}
                        >
                          <h3 className="font-medium">{type.name}</h3>
                          <p className="text-sm text-gray-500">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="bg-custom-purple hover:bg-custom-purple-dark w-full"
                    onClick={handleCreateMeeting}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Meeting Link'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your Interview Session is Ready</DialogTitle>
              <DialogDescription>
                Share this link with participants or send them an email invitation.
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
                <Copy className="h-4 w-4" />
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
                  Invite
                </Button>
              </div>
            </div>

            <DialogFooter className="sm:justify-start mt-6">
              <Button 
                type="button" 
                className="bg-green-600 hover:bg-green-700"
                onClick={joinMeeting}
              >
                Join as Host <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Interview Session Features</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-custom-purple-light flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-custom-purple-dark" />
                    </div>
                    <CardTitle>Multiple Participants</CardTitle>
                    <CardDescription>Invite co-interviewers to join your session and collaborate on evaluating candidates.</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-custom-purple-light flex items-center justify-center mb-4">
                      <User className="h-6 w-6 text-custom-purple-dark" />
                    </div>
                    <CardTitle>Candidate Experience</CardTitle>
                    <CardDescription>Professional interface with waiting room and interview preparation materials.</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StartLiveInterview;
