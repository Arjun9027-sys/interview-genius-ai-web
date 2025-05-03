
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">InterviewGenius</span>
            </Link>
            <p className="mt-4 text-gray-600">
              InterviewGenius helps you prepare for job interviews with AI-powered tools, practice sessions, and resume building.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/live-interview" className="text-gray-600 hover:text-custom-purple">
                  Live Interview
                </Link>
              </li>
              <li>
                <Link to="/ai-interview" className="text-gray-600 hover:text-custom-purple">
                  AI Interview
                </Link>
              </li>
              <li>
                <Link to="/resume-builder" className="text-gray-600 hover:text-custom-purple">
                  Resume Builder
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-custom-purple">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-custom-purple">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-custom-purple">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-custom-purple">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-center">
            © {new Date().getFullYear()} InterviewGenius. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
