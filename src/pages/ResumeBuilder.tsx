
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';

const ResumeBuilder = () => {
  const resumeTemplates = [
    { name: "Professional", color: "bg-gray-200" },
    { name: "Modern", color: "bg-blue-200" },
    { name: "Creative", color: "bg-purple-200" },
    { name: "Minimal", color: "bg-green-200" },
  ];

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
              <Button className="bg-custom-purple hover:bg-custom-purple-dark text-lg px-8 py-6">
                Create New Resume
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Choose a Template</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resumeTemplates.map((template, index) => (
                <Card key={index} className="card-hover cursor-pointer overflow-hidden">
                  <div className={`${template.color} h-48 flex items-center justify-center`}>
                    <FileText className="h-16 w-16 text-gray-600 opacity-50" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg">{template.name}</h3>
                    <p className="text-gray-500 text-sm">Template</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Resume Building Process</h2>
              <p className="text-gray-600">
                Follow our guided process to create a standout resume that helps you land interviews.
              </p>
            </div>
            
            <Tabs defaultValue="details" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="details">Personal Details</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>
              <div className="mt-6 p-4 border rounded-lg">
                <TabsContent value="details">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">Step 1: Personal Details</h3>
                    <p className="text-gray-600 mb-6">
                      Start by adding your contact information and professional summary.
                    </p>
                    <Button className="bg-custom-purple hover:bg-custom-purple-dark">
                      Begin
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="experience">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">Step 2: Work Experience</h3>
                    <p className="text-gray-600 mb-6">
                      Add your work history with detailed accomplishments for each position.
                    </p>
                    <Button className="bg-custom-purple hover:bg-custom-purple-dark">
                      Add Experience
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="education">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">Step 3: Education</h3>
                    <p className="text-gray-600 mb-6">
                      Include your academic background, certifications, and relevant courses.
                    </p>
                    <Button className="bg-custom-purple hover:bg-custom-purple-dark">
                      Add Education
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="skills">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">Step 4: Skills & Achievements</h3>
                    <p className="text-gray-600 mb-6">
                      Highlight your technical and soft skills that align with your target role.
                    </p>
                    <Button className="bg-custom-purple hover:bg-custom-purple-dark">
                      Add Skills
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="export">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">Step 5: Export & Share</h3>
                    <p className="text-gray-600 mb-6">
                      Preview, download, or share your finished resume in multiple formats.
                    </p>
                    <Button className="bg-custom-purple hover:bg-custom-purple-dark">
                      Export Resume
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </section>
        
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
