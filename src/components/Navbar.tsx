
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 border-b border-gray-200">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">InterviewGenius</span>
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link to="/" className="text-gray-700 hover:text-custom-purple font-medium">
            Home
          </Link>
          <Link to="/live-interview" className="text-gray-700 hover:text-custom-purple font-medium">
            Live Interview
          </Link>
          <Link to="/ai-interview" className="text-gray-700 hover:text-custom-purple font-medium">
            AI Interview
          </Link>
          <Link to="/resume-builder" className="text-gray-700 hover:text-custom-purple font-medium">
            Resume Builder
          </Link>
          <Button variant="default" className="bg-custom-purple hover:bg-custom-purple-dark">
            Get Started
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16 px-4">
          <div className="flex flex-col space-y-6">
            <Link 
              to="/" 
              className="text-xl text-gray-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/live-interview" 
              className="text-xl text-gray-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Live Interview
            </Link>
            <Link 
              to="/ai-interview" 
              className="text-xl text-gray-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Interview
            </Link>
            <Link 
              to="/resume-builder" 
              className="text-xl text-gray-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Resume Builder
            </Link>
            <Button 
              variant="default" 
              className="bg-custom-purple hover:bg-custom-purple-dark w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
