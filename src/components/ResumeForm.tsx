
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Import our new components
import PersonalInfoSection from "./resume/PersonalInfoSection";
import SummarySection from "./resume/SummarySection";
import ExperienceSection from "./resume/ExperienceSection";
import EducationSection from "./resume/EducationSection";
import SkillsSection from "./resume/SkillsSection";
import ResumePreviewSection from "./resume/ResumePreviewSection";
import ResumeNavigation from "./resume/ResumeNavigation";
import { resumeFormSchema, ResumeFormValues } from "./resume/types";

interface ResumeFormProps {
  onSave: (data: ResumeFormValues) => void;
  selectedTemplate: string;
}

const ResumeForm = ({ onSave, selectedTemplate }: ResumeFormProps) => {
  const [activeSection, setActiveSection] = useState<string>("personalInfo");
  const [isFresher, setIsFresher] = useState(false);
  
  const defaultValues: ResumeFormValues = {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      portfolio: "",
      linkedin: "",
    },
    summary: "",
    experiences: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        current: false,
      },
    ],
    skills: [""],
  };

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = (data: ResumeFormValues) => {
    // Filter out empty skills
    data.skills = data.skills.filter((skill) => skill.trim() !== "");
    
    // Call the onSave callback
    onSave(data);
    
    // Show success toast
    toast({
      title: "Resume saved!",
      description: "Your resume has been successfully saved.",
    });
  };

  const handleFresherToggle = (checked: boolean) => {
    setIsFresher(checked);
    
    if (checked) {
      // Clear existing experiences and add a fresher placeholder
      form.setValue("experiences", [{
        company: "Fresher",
        position: "No Prior Work Experience",
        startDate: new Date().getFullYear().toString(),
        endDate: "Present",
        current: true,
        description: "Currently seeking my first professional opportunity. During my education, I focused on building relevant skills and knowledge in my field of study."
      }]);
    } else {
      // Reset to default experience
      form.setValue("experiences", [{
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      }]);
    }
  };

  const resumeNavigation = [
    { id: "personalInfo", label: "Personal Info" },
    { id: "summary", label: "Summary" },
    { id: "experiences", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "preview", label: "Preview" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <ResumeNavigation 
        sections={resumeNavigation} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          {activeSection === "personalInfo" && <PersonalInfoSection form={form} />}

          {/* Professional Summary Section */}
          {activeSection === "summary" && <SummarySection form={form} />}

          {/* Work Experience Section */}
          {activeSection === "experiences" && (
            <ExperienceSection form={form} isFresher={isFresher} onFresherToggle={handleFresherToggle} />
          )}

          {/* Education Section */}
          {activeSection === "education" && <EducationSection form={form} />}

          {/* Skills Section */}
          {activeSection === "skills" && <SkillsSection form={form} />}

          {/* Preview Section */}
          {activeSection === "preview" && <ResumePreviewSection form={form} />}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                const currentIndex = resumeNavigation.findIndex(item => item.id === activeSection);
                if (currentIndex > 0) {
                  setActiveSection(resumeNavigation[currentIndex - 1].id);
                }
              }}
              disabled={activeSection === resumeNavigation[0].id}
            >
              Previous
            </Button>
            
            {activeSection === "preview" ? (
              <Button type="submit" className="bg-custom-purple hover:bg-custom-purple-dark">
                <FileText className="mr-2 h-4 w-4" /> Save Resume
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={() => {
                  const currentIndex = resumeNavigation.findIndex(item => item.id === activeSection);
                  if (currentIndex < resumeNavigation.length - 1) {
                    setActiveSection(resumeNavigation[currentIndex + 1].id);
                  }
                }}
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResumeForm;
