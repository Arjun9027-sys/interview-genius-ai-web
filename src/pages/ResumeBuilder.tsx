
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Share2 } from 'lucide-react';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { toast } from '@/hooks/use-toast';

// Define resume data interface
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

const ResumeBuilder = () => {
  // Define resume templates with more properties
  const resumeTemplates = [
    { 
      name: "Professional", 
      color: "bg-gray-200", 
      accent: "border-gray-700",
      textColor: "text-gray-800",
      headerBg: "bg-gray-100",
      description: "Clean, minimal design with a focus on content and readability."
    },
    { 
      name: "Modern", 
      color: "bg-blue-200", 
      accent: "border-blue-500",
      textColor: "text-blue-900",
      headerBg: "bg-blue-50",
      description: "Contemporary design with bold headings and modern typography."
    },
    { 
      name: "Creative", 
      color: "bg-purple-200", 
      accent: "border-purple-500",
      textColor: "text-purple-900",
      headerBg: "bg-purple-50",
      description: "Unique layout with colorful accents for creative professionals."
    },
    { 
      name: "Minimal", 
      color: "bg-green-200", 
      accent: "border-green-500",
      textColor: "text-green-900",
      headerBg: "bg-green-50",
      description: "Ultra-minimalist design that lets your experience speak for itself."
    },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(resumeTemplates[0].name);
  const [isBuilding, setIsBuilding] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState("choose-template");
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Handle template selection
  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template);
    setActiveTab("build-resume");
  };

  // Handle resume data save
  const handleSaveResume = (data: ResumeData) => {
    setResumeData(data);
    toast({
      title: "Resume saved successfully!",
      description: "Your resume has been created and is ready to download.",
    });
    setActiveTab("preview-resume");
  };

  // Handle resume download
  const handleDownloadResume = () => {
    setPdfGenerating(true);
    toast({
      title: "Download started",
      description: "Your resume is being prepared as a PDF for download.",
    });
    // In a real implementation, we'd call a PDF generation service here
    setTimeout(() => {
      setPdfGenerating(false);
      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded successfully.",
      });
      
      // Simulate download by creating a blob and triggering download
      // In a real implementation, this would be a PDF file
      const dummyBlob = new Blob(['PDF Content'], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dummyBlob);
      link.download = `${resumeData?.personalInfo.fullName || 'Resume'}_${selectedTemplate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2000);
  };

  // Handle resume sharing
  const handleShareResume = () => {
    toast({
      title: "Sharing options",
      description: "Choose how you want to share your resume",
    });

    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: `${resumeData?.personalInfo.fullName || 'My'} Resume`,
        text: 'Check out my professional resume created with Resume Builder',
      }).catch(() => {
        toast({
          title: "Sharing cancelled",
          description: "You cancelled the share operation"
        });
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      toast({
        title: "Share via link",
        description: "Resume link copied to clipboard!",
      });
    }
  };

  const resetBuilder = () => {
    setIsBuilding(false);
    setResumeData(null);
    setActiveTab("choose-template");
  };

  // Start new resume
  const startNewResume = () => {
    setIsBuilding(true);
    setActiveTab("choose-template");
  };

  // Get template object
  const getTemplateObject = () => {
    return resumeTemplates.find(t => t.name === selectedTemplate) || resumeTemplates[0];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-custom-blue-soft">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Resume Builder</h1>
              <p className="text-xl text-gray-600 mb-8">
                Create a professional, ATS-friendly resume with our easy-to-use builder and AI-powered suggestions.
              </p>
              {!isBuilding && (
                <Button 
                  onClick={startNewResume} 
                  className="bg-custom-purple hover:bg-custom-purple-dark text-lg px-8 py-6"
                >
                  Create New Resume
                </Button>
              )}
              {isBuilding && resumeData && (
                <div className="space-x-4">
                  <Button 
                    onClick={resetBuilder} 
                    variant="outline" 
                    className="text-lg px-6 py-6"
                  >
                    Create New Resume
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("preview-resume")} 
                    className="bg-custom-purple hover:bg-custom-purple-dark text-lg px-6 py-6"
                  >
                    View Current Resume
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {isBuilding && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full max-w-6xl mx-auto"
              >
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="choose-template">Choose Template</TabsTrigger>
                  <TabsTrigger value="build-resume" disabled={!selectedTemplate}>Build Resume</TabsTrigger>
                  <TabsTrigger value="preview-resume" disabled={!resumeData}>Preview & Download</TabsTrigger>
                </TabsList>
                
                {/* Template Selection */}
                <TabsContent value="choose-template">
                  <h2 className="text-3xl font-bold mb-8 text-center">Choose a Template</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resumeTemplates.map((template, index) => (
                      <Card 
                        key={index} 
                        className={`card-hover cursor-pointer overflow-hidden transition-all duration-200 transform hover:scale-105 ${selectedTemplate === template.name ? 'ring-2 ring-custom-purple shadow-lg' : ''}`}
                        onClick={() => handleSelectTemplate(template.name)}
                      >
                        <div className={`${template.color} h-48 flex items-center justify-center border-b-4 ${template.accent}`}>
                          <FileText className={`h-16 w-16 ${template.textColor} opacity-50`} />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg">{template.name}</h3>
                          <p className="text-gray-500 text-sm mt-1">{template.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <Button 
                      onClick={() => setActiveTab("build-resume")} 
                      disabled={!selectedTemplate}
                      className="bg-custom-purple hover:bg-custom-purple-dark"
                    >
                      Continue with {selectedTemplate} Template
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Resume Building Form */}
                <TabsContent value="build-resume">
                  <h2 className="text-3xl font-bold mb-8 text-center">Build Your Resume</h2>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <ResumeForm onSave={handleSaveResume} selectedTemplate={selectedTemplate} />
                  </div>
                </TabsContent>
                
                {/* Resume Preview */}
                <TabsContent value="preview-resume">
                  {resumeData ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <ResumePreview 
                        data={resumeData} 
                        template={selectedTemplate} 
                        templateStyles={getTemplateObject()} 
                        onDownload={handleDownloadResume} 
                      />
                      <div className="mt-8 text-center flex flex-wrap justify-center gap-4">
                        <Button 
                          onClick={() => setActiveTab("build-resume")} 
                          variant="outline" 
                        >
                          Edit Resume
                        </Button>
                        <Button 
                          onClick={handleDownloadResume} 
                          className="bg-custom-purple hover:bg-custom-purple-dark"
                          disabled={pdfGenerating}
                        >
                          <Download className="mr-2 h-4 w-4" /> 
                          {pdfGenerating ? "Generating PDF..." : "Download PDF"}
                        </Button>
                        <Button 
                          onClick={handleShareResume} 
                          variant="outline"
                        >
                          <Share2 className="mr-2 h-4 w-4" /> Share Resume
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-12">
                      <h3 className="text-2xl font-bold mb-4">No Resume Data</h3>
                      <p className="text-gray-600 mb-6">You haven't created a resume yet. Start by selecting a template and building your resume.</p>
                      <Button 
                        onClick={() => setActiveTab("choose-template")} 
                        className="bg-custom-purple hover:bg-custom-purple-dark"
                      >
                        Start Building
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">AI-Powered Resume Tips</h2>
                <p className="text-gray-600">
                  Get personalized suggestions to improve your resume's impact and ATS compatibility.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-custom-blue-soft rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Content Suggestions</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-custom-purple mr-2"></div>
                      <span>Action verb recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-custom-purple mr-2"></div>
                      <span>Achievement quantification</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-custom-purple mr-2"></div>
                      <span>Industry-specific keyword analysis</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-custom-purple mr-2"></div>
                      <span>Skill gap identification</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-custom-blue-soft rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Formatting Improvements</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-custom-purple mr-2"></div>
                      <span>Layout optimization</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-custom-purple mr-2"></div>
                      <span>Section organization</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-custom-purple mr-2"></div>
                      <span>ATS compatibility checks</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-custom-purple mr-2"></div>
                      <span>Visual hierarchy improvements</span>
                    </li>
                  </ul>
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

export default ResumeBuilder;
