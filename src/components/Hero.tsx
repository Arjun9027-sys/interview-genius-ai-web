
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-custom-blue-soft">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="lg:w-1/2 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Ace Your Next Interview with <span className="gradient-text">AI-Powered Preparation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Practice with realistic interview simulations, receive instant feedback, and build a standout resume all in one platform.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button asChild className="bg-custom-purple hover:bg-custom-purple-dark text-lg px-8 py-6">
                <Link to="/ai-interview">Try AI Interview</Link>
              </Button>
              <Button variant="outline" asChild className="border-custom-purple text-custom-purple hover:bg-custom-purple-light text-lg px-8 py-6">
                <Link to="/resume-builder">Build Resume</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 animate-scale-in">
            <div className="relative">
              <div className="w-full h-full rounded-xl bg-gradient-to-r from-custom-purple to-custom-blue-bright p-1">
                <div className="bg-white rounded-lg p-6 md:p-8">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-8">
                      <h2 className="text-2xl font-bold mb-4">Interactive AI Interviews</h2>
                      <p className="text-gray-600">Practice with our AI interviewer to build confidence and improve your skills</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-custom-purple-light rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-custom-blue-soft rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
