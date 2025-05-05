
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    portfolio?: string;
    linkedin?: string;
  };
  summary?: string;
  experiences: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
  }[];
  skills: string[];
}

interface ResumePreviewProps {
  data: ResumeData;
  template: string;
  onDownload: () => void;
}

const ResumePreview = ({ data, template, onDownload }: ResumePreviewProps) => {
  // Function to determine preview styling based on template
  const getTemplateStyle = () => {
    switch (template) {
      case "Professional":
        return "font-serif";
      case "Modern":
        return "font-sans";
      case "Creative":
        return "font-sans";
      case "Minimal":
        return "font-mono";
      default:
        return "font-sans";
    }
  };

  const getTemplateColor = () => {
    switch (template) {
      case "Professional":
        return "border-gray-300";
      case "Modern":
        return "border-blue-300";
      case "Creative":
        return "border-purple-300";
      case "Minimal":
        return "border-green-300";
      default:
        return "border-gray-300";
    }
  };

  // Check if the user is a fresher
  const isFresher = data.experiences.length === 1 && 
    data.experiences[0].company === "Fresher" && 
    data.experiences[0].position === "No Prior Work Experience";

  const templateClass = `${getTemplateStyle()} ${getTemplateColor()} border-t-4`;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Resume Preview</h2>
        <Button 
          onClick={onDownload} 
          className="bg-custom-purple hover:bg-custom-purple-dark"
        >
          <FileText className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>
      
      <div className={`bg-white shadow-lg rounded-lg p-8 ${templateClass}`}>
        {/* Header with personal info */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">{data.personalInfo.fullName}</h1>
          <div className="text-sm text-gray-600 flex flex-wrap justify-center gap-x-4">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          </div>
          <div className="text-sm text-gray-600 mt-1 flex flex-wrap justify-center gap-x-4">
            {data.personalInfo.portfolio && <span>{data.personalInfo.portfolio}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          </div>
        </div>
        
        {/* Summary section */}
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Professional Summary</h2>
            <p className="text-sm">{data.summary}</p>
          </div>
        )}
        
        {/* Experience section */}
        {data.experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h2>
            {isFresher ? (
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <h3 className="font-medium text-gray-700">Fresher</h3>
                  <span className="text-sm text-gray-600">
                    {data.experiences[0].startDate} - Present
                  </span>
                </div>
                {data.experiences[0].description && (
                  <p className="text-sm mt-1 italic">{data.experiences[0].description}</p>
                )}
              </div>
            ) : (
              data.experiences.map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                    <h3 className="font-medium">{exp.position} - {exp.company}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Education section */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <h3 className="font-medium">
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""} - {edu.institution}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.current ? "Expected" : edu.endDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Skills section */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
