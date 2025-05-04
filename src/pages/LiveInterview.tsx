
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const LiveInterview = () => {
  const interviewTypes = [
    {
      title: "Technical Interview",
      description: "Practice coding problems, system design, and technical concepts with experienced engineers",
      duration: "45 minutes",
    },
    {
      title: "Behavioral Interview",
      description: "Refine your responses to questions about your experience, teamwork, and problem-solving",
      duration: "30 minutes",
    },
    {
      title: "Case Interview",
      description: "Work through business cases and analytical problems with industry professionals",
      duration: "60 minutes",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-custom-blue-soft">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Live Interview Practice</h1>
              <p className="text-xl text-gray-600 mb-8">
                Schedule a one-on-one session with professional interviewers for personalized feedback and coaching.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-custom-purple hover:bg-custom-purple-dark text-lg px-8 py-6"
                  asChild
                >
                  <Link to="/start-live-interview">
                    Start a New Interview <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button className="bg-custom-purple-light hover:bg-custom-purple text-lg px-8 py-6">
                  View Available Sessions
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Choose Your Interview Type</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {interviewTypes.map((type, index) => (
                <Card key={index} className="card-hover">
                  <CardHeader>
                    <CardTitle>{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{type.duration}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-custom-purple hover:bg-custom-purple-dark">
                      Schedule
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6">How It Works</h2>
                <ol className="space-y-6">
                  <li className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-custom-purple text-white">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Choose a Session Type</h3>
                      <p className="text-gray-600">Select the interview format that matches your needs</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-custom-purple text-white">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Select a Time Slot</h3>
                      <p className="text-gray-600">Browse available times with our professional interviewers</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-custom-purple text-white">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Complete Your Session</h3>
                      <p className="text-gray-600">Join the video call at your scheduled time and receive expert feedback</p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Available This Week</h3>
                    <p className="text-gray-600">Select a date to view open time slots</p>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                    <Calendar className="h-32 w-32 text-custom-purple opacity-50" />
                  </div>
                  <Button className="w-full bg-custom-purple hover:bg-custom-purple-dark">
                    View Calendar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LiveInterview;
