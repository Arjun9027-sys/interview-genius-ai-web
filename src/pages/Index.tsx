
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeatureSection />
        
        <section className="py-16 bg-custom-blue-soft">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ace Your Next Interview?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of job seekers who've improved their interview performance with InterviewGenius.
            </p>
            <a 
              href="#" 
              className="inline-block px-8 py-4 bg-custom-purple hover:bg-custom-purple-dark text-white font-bold rounded-lg transition-colors"
            >
              Get Started for Free
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
