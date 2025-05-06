import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play, User, Volume, VolumeX, MessageSquare } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { interviewService, InterviewQuestion, InterviewResponse, jobSkillsByCategory } from '@/services/InterviewService';
import { SpeechToText, TextToSpeech } from '@/utils/SpeechUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

// Define technical languages/frameworks by job skill
const technicalLanguagesBySkill: Record<string, string[]> = {
  "Frontend Development": ["JavaScript", "TypeScript", "React", "Vue.js", "Angular", "HTML/CSS", "Next.js", "Tailwind CSS"],
  "Backend Development": ["Node.js", "Python", "Java", "C#", "Go", "PHP", "Ruby", "SQL", "MongoDB"],
  "Full Stack Development": ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "MongoDB", "GraphQL", "REST API"],
  "Mobile App Development": ["React Native", "Flutter", "Swift", "Kotlin", "Java", "Objective-C"],
  "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins", "Terraform"],
  "Cloud Architecture": ["AWS", "Azure", "GCP", "Serverless", "Microservices", "Terraform", "CloudFormation"],
  "Database Management": ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Oracle", "NoSQL"],
  "UI/UX Development": ["Figma", "Adobe XD", "HTML/CSS", "JavaScript", "React", "Sketch", "Responsive Design"],
  "Machine Learning": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "R", "Keras", "NLTK"],
  "Data Analysis": ["Python", "R", "SQL", "Excel", "Tableau", "Power BI", "Pandas", "NumPy"],
  "Big Data Processing": ["Spark", "Hadoop", "Kafka", "Hive", "Python", "Scala", "Flink"],
  // Add more mappings for other job skills
};

// Default languages for job skills not explicitly listed
const defaultTechnicalLanguages = ["JavaScript", "Python", "Java", "C++", "Go", "Ruby"];

const AiInterview = () => {
  // Basic state
  const [isStarted, setIsStarted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [interimResponse, setInterimResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  // Speech utilities
  const speechToTextRef = useRef<SpeechToText | null>(null);
  const textToSpeechRef = useRef<TextToSpeech | null>(null);
  
  // Initialize speech utilities
  useEffect(() => {
    speechToTextRef.current = new SpeechToText();
    textToSpeechRef.current = new TextToSpeech();
    
    // Cleanup
    return () => {
      if (speechToTextRef.current?.isActive()) {
        speechToTextRef.current.stop();
      }
      if (textToSpeechRef.current?.isSpeaking()) {
        textToSpeechRef.current.stop();
      }
    };
  }, []);
  
  // Update available skills when job category changes
  useEffect(() => {
    if (selectedCategory) {
      const skills = jobSkillsByCategory[selectedCategory] || [];
      setAvailableSkills(skills);
      setSelectedSkill(null);
      setSelectedLanguage(null);
    }
  }, [selectedCategory]);
  
  // Update available languages when job skill changes
  useEffect(() => {
    if (selectedSkill) {
      const languages = technicalLanguagesBySkill[selectedSkill] || defaultTechnicalLanguages;
      setAvailableLanguages(languages);
      setSelectedLanguage(null);
    }
  }, [selectedSkill]);
  
  const jobCategories = Object.keys(jobSkillsByCategory);
  
  const startInterview = () => {
    if (!selectedCategory) {
      toast.error('Please select a job category first');
      return;
    }
    
    if (!selectedSkill) {
      toast.error('Please select a specific job skill');
      return;
    }
    
    // Initialize interview session with all selected criteria
    const session = interviewService.startSession(
      selectedCategory, 
      selectedSkill,
      selectedLanguage || undefined
    );
    
    const firstQuestion = interviewService.getCurrentQuestion();
    setCurrentQuestion(firstQuestion);
    
    // Start the interview
    setIsStarted(true);
    
    // Speak the first question
    if (firstQuestion && textToSpeechRef.current) {
      textToSpeechRef.current.speak(firstQuestion.text);
    }
  };
  
  const toggleMicrophone = () => {
    if (!speechToTextRef.current?.isSupported()) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }
    
    if (isMicOn) {
      // Turn off microphone
      speechToTextRef.current.stop();
      setIsMicOn(false);
      
      // Submit the current response if we have one
      if (userResponse.trim()) {
        submitResponse();
      }
    } else {
      // Turn on microphone
      const success = speechToTextRef.current.start(
        (text) => {
          setUserResponse(prev => prev + ' ' + text);
        },
        (interimText) => {
          setInterimResponse(interimText);
        }
      );
      
      if (success) {
        setIsMicOn(true);
        setInterimResponse('');
      } else {
        toast.error('Failed to start speech recognition');
      }
    }
  };
  
  const submitResponse = async () => {
    if (!userResponse.trim()) {
      toast.error('Please provide a response first');
      return;
    }
    
    // Turn off microphone if it's on
    if (isMicOn && speechToTextRef.current) {
      speechToTextRef.current.stop();
      setIsMicOn(false);
    }
    
    setIsThinking(true);
    
    try {
      // Submit the response and get the next question
      const nextQuestion = await interviewService.submitResponse(userResponse);
      
      // Clear the current response
      setUserResponse('');
      setInterimResponse('');
      
      // Update the current question
      setCurrentQuestion(nextQuestion);
      
      // Speak the next question if available
      if (nextQuestion && textToSpeechRef.current) {
        textToSpeechRef.current.speak(nextQuestion.text);
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to process your response');
    } finally {
      setIsThinking(false);
    }
  };
  
  const endSession = () => {
    // Stop any ongoing speech or recognition
    if (speechToTextRef.current?.isActive()) {
      speechToTextRef.current.stop();
    }
    if (textToSpeechRef.current?.isSpeaking()) {
      textToSpeechRef.current.stop();
    }
    
    setIsStarted(false);
    setIsMicOn(false);
    setUserResponse('');
    setInterimResponse('');
    setCurrentQuestion(null);
  };
  
  const viewFeedback = async () => {
    setIsThinking(true);
    
    try {
      const feedbackText = await interviewService.getFeedback();
      setFeedback(feedbackText);
      setIsFeedbackOpen(true);
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast.error('Failed to generate feedback');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-custom-blue-soft">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">AI-Powered Interview Practice</h1>
              <p className="text-xl text-gray-600 mb-8">
                Practice with our intelligent AI interviewer and get instant feedback on your responses.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <h2 className="text-2xl font-bold mb-6 gradient-text">Interview Configuration</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="job-category">Select Job Category</Label>
                    <Select 
                      disabled={isStarted}
                      value={selectedCategory || ""}
                      onValueChange={(value) => setSelectedCategory(value)}
                    >
                      <SelectTrigger id="job-category" className="w-full">
                        <SelectValue placeholder="Select job category" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobCategories.map((category, index) => (
                          <SelectItem key={index} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedCategory && (
                    <div className="space-y-2">
                      <Label htmlFor="job-skill">Select Job Skill</Label>
                      <Select 
                        disabled={isStarted || !selectedCategory}
                        value={selectedSkill || ""}
                        onValueChange={(value) => setSelectedSkill(value)}
                      >
                        <SelectTrigger id="job-skill" className="w-full">
                          <SelectValue placeholder="Select specific skill" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSkills.map((skill, index) => (
                            <SelectItem key={index} value={skill}>
                              {skill}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedSkill && (
                    <div className="space-y-2">
                      <Label htmlFor="technical-language">Select Technical Language/Framework</Label>
                      <Select 
                        disabled={isStarted || !selectedSkill}
                        value={selectedLanguage || ""}
                        onValueChange={(value) => setSelectedLanguage(value)}
                      >
                        <SelectTrigger id="technical-language" className="w-full">
                          <SelectValue placeholder="Select language or framework" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLanguages.map((language, index) => (
                            <SelectItem key={index} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-custom-purple to-custom-blue-bright button-glow shadow-md"
                    onClick={startInterview}
                    disabled={!selectedCategory || !selectedSkill || isStarted}
                  >
                    <Play className="h-4 w-4 mr-2" /> Start Interview
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 fancy-border">
                  <CardHeader>
                    <CardTitle className="text-2xl gradient-text">AI Interview Simulator</CardTitle>
                    <CardDescription>
                      {isStarted 
                        ? `Interviewing for: ${selectedCategory} - ${selectedSkill}`
                        : "Configure your interview settings on the left, then start an interview session."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 glass-card">
                      {isStarted ? (
                        <div className="space-y-6">
                          <div className="flex items-start space-x-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-custom-purple to-custom-blue-bright flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">AI Interviewer</p>
                              <p className="text-gray-700 mt-2">
                                {currentQuestion?.text || "Loading question..."}
                              </p>
                            </div>
                          </div>
                          
                          {userResponse || interimResponse ? (
                            <div className="flex items-start space-x-4 mt-6">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">You</p>
                                <p className="text-gray-700 mt-2">
                                  {userResponse}
                                  {interimResponse && (
                                    <span className="text-gray-400 italic"> {interimResponse}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          ) : null}
                          
                          <div className="border-t border-gray-200 pt-6">
                            <div className="flex flex-col items-center justify-center space-y-4">
                              <div className="flex space-x-4">
                                <Button 
                                  variant={isMicOn ? "default" : "outline"}
                                  className={`rounded-full w-16 h-16 button-glow ${isMicOn 
                                    ? 'bg-gradient-to-r from-custom-purple to-custom-blue-bright' 
                                    : 'border-custom-purple text-custom-purple'}`}
                                  onClick={toggleMicrophone}
                                  disabled={isThinking}
                                >
                                  {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                                </Button>
                                
                                {textToSpeechRef.current?.isSupported() && (
                                  <Button
                                    variant="outline"
                                    className="rounded-full w-12 h-12 border-custom-purple text-custom-purple"
                                    onClick={() => {
                                      if (currentQuestion && textToSpeechRef.current) {
                                        textToSpeechRef.current.speak(currentQuestion.text);
                                      }
                                    }}
                                    disabled={!currentQuestion || isThinking}
                                  >
                                    <Volume className="h-5 w-5" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-center text-gray-600">
                                {isMicOn 
                                  ? "Listening... Speak your answer" 
                                  : "Click to enable microphone"}
                              </p>
                              
                              {userResponse && (
                                <Button 
                                  className="mt-4 bg-gradient-to-r from-custom-purple to-custom-blue-bright"
                                  onClick={submitResponse}
                                  disabled={isThinking}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Submit Response
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-custom-purple-light to-custom-blue-soft flex items-center justify-center mb-6 animate-float shadow-md">
                            <User className="h-12 w-12 text-custom-purple" />
                          </div>
                          <p className="text-xl font-medium text-gray-700 mb-2">Ready to begin your practice interview?</p>
                          <p className="text-gray-600 mb-6 text-center">
                            Select job category and skill on the left, then click Start Interview.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-custom-purple text-custom-purple"
                        onClick={endSession}
                        disabled={!isStarted}
                      >
                        End Session
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-custom-purple to-custom-blue-bright button-glow"
                        onClick={viewFeedback}
                        disabled={!isStarted || isThinking || (interviewService.getCurrentSession()?.responses.length || 0) < 1}
                      >
                        View Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-text">Why Practice with AI?</h2>
              <p className="text-gray-600">
                Our AI interviewer helps you build confidence and improve your interview skills through realistic practice.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="card-hover glass-card">
                <CardHeader>
                  <CardTitle className="gradient-text">Realistic Questions</CardTitle>
                  <CardDescription>
                    Industry-specific questions that simulate real interview scenarios
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="card-hover glass-card">
                <CardHeader>
                  <CardTitle className="gradient-text">Instant Feedback</CardTitle>
                  <CardDescription>
                    Receive immediate analysis on your response clarity, relevance, and delivery
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="card-hover glass-card">
                <CardHeader>
                  <CardTitle className="gradient-text">Practice Anytime</CardTitle>
                  <CardDescription>
                    Available 24/7 so you can practice whenever it fits your schedule
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      {/* Interview Feedback Dialog */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Feedback</DialogTitle>
            <DialogDescription>
              Here's a comprehensive analysis of your interview performance.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {feedback ? (
              <div className="prose max-w-none">
                <Textarea 
                  value={feedback} 
                  readOnly 
                  className="min-h-[300px] p-4"
                />
              </div>
            ) : (
              <p>Loading feedback...</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AiInterview;
