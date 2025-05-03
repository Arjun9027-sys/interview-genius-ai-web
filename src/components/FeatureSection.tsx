
import { Video, User, FileText } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeatureSection = () => {
  const features = [
    {
      title: "Live Interview Practice",
      description: "Connect with real interviewers for personalized practice sessions and detailed feedback.",
      icon: <Video className="h-6 w-6 text-custom-purple-dark" />,
      linkTo: "/live-interview",
      buttonText: "Schedule Session"
    },
    {
      title: "AI-Powered Interviews",
      description: "Practice anytime with our intelligent AI interviewer and receive instant feedback on your responses.",
      icon: <User className="h-6 w-6 text-custom-purple-dark" />,
      linkTo: "/ai-interview",
      buttonText: "Start Interview"
    },
    {
      title: "Professional Resume Builder",
      description: "Create an ATS-friendly resume with our guided builder and AI-powered suggestions.",
      icon: <FileText className="h-6 w-6 text-custom-purple-dark" />,
      linkTo: "/resume-builder",
      buttonText: "Build Resume"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prepare for Success</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of interview preparation tools will help you land your dream job.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
