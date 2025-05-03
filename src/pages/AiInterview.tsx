
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play, User } from 'lucide-react';

const AiInterview = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  
  const jobCategories = [
    "Software Engineering",
    "Data Science",
    "Product Management",
    "Marketing",
    "Sales",
    "Customer Success",
    "Design",
    "Finance",
    "Human Resources"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-custom-blue-soft">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">AI-Powered Interview Practice</h1>
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
                <h2 className="text-2xl font-bold mb-6">Select Job Category</h2>
                <div className="space-y-2">
                  {jobCategories.map((category, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start text-left border border-gray-200 hover:border-custom-purple hover:text-custom-purple"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <Card className="border-2 border-gray-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl">AI Interview Simulator</CardTitle>
                    <CardDescription>
                      {isStarted 
                        ? "Answer the questions naturally as you would in a real interview."
                        : "Start an interview session with our AI interviewer to practice your responses."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      {isStarted ? (
                        <div className="space-y-6">
                          <div className="flex items-start space-x-4">
                            <div className="h-10 w-10 rounded-full bg-custom-purple flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">AI Interviewer</p>
                              <p className="text-gray-700 mt-2">
                                Tell me about a challenging project you've worked on and how you approached it.
                              </p>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-center">
                              <Button 
                                variant={isMicOn ? "default" : "outline"}
                                className={`rounded-full w-16 h-16 ${isMicOn ? 'bg-custom-purple' : 'border-custom-purple text-custom-purple'}`}
                                onClick={() => setIsMicOn(!isMicOn)}
                              >
                                {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                              </Button>
                            </div>
                            <p className="text-center mt-4 text-gray-600">
                              {isMicOn ? "Listening..." : "Click to enable microphone"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10">
                          <div className="h-24 w-24 rounded-full bg-custom-purple-light flex items-center justify-center mb-6">
                            <User className="h-12 w-12 text-custom-purple" />
                          </div>
                          <p className="text-xl font-medium text-gray-700 mb-2">Ready to begin your practice interview?</p>
                          <p className="text-gray-600 mb-6 text-center">
                            You'll receive questions based on the job category you select.
                          </p>
                          <Button 
                            className="bg-custom-purple hover:bg-custom-purple-dark"
                            onClick={() => setIsStarted(true)}
                          >
                            <Play className="h-4 w-4 mr-2" /> Start Interview
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setIsStarted(false);
                          setIsMicOn(false);
                        }}
                      >
                        End Session
                      </Button>
                      <Button className="flex-1 bg-custom-purple hover:bg-custom-purple-dark">
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
              <h2 className="text-3xl font-bold mb-4">Why Practice with AI?</h2>
              <p className="text-gray-600">
                Our AI interviewer helps you build confidence and improve your interview skills through realistic practice.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Realistic Questions</CardTitle>
                  <CardDescription>
                    Industry-specific questions that simulate real interview scenarios
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Instant Feedback</CardTitle>
                  <CardDescription>
                    Receive immediate analysis on your response clarity, relevance, and delivery
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Practice Anytime</CardTitle>
                  <CardDescription>
                    Available 24/7 so you can practice whenever it fits your schedule
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AiInterview;
