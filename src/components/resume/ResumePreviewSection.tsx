
import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/components/resume/types";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumePreviewSectionProps {
  form: UseFormReturn<ResumeFormValues>;
}

const ResumePreviewSection = ({ form }: ResumePreviewSectionProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-r from-custom-purple to-custom-blue-bright text-white">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-semibold">Resume Preview</h2>
        </div>
        <Button variant="outline" className="button-glow">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>
      
      <div className="p-8 border rounded-xl shadow-lg bg-white fancy-border">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-shadow-sm">{form.watch("personalInfo.fullName") || "Your Name"}</h1>
          <div className="text-sm text-gray-600 mt-2 flex flex-wrap justify-center gap-x-4">
            {form.watch("personalInfo.email") && (
              <span>{form.watch("personalInfo.email")}</span>
            )}
            {form.watch("personalInfo.phone") && (
              <span>{form.watch("personalInfo.phone")}</span>
            )}
            {form.watch("personalInfo.location") && (
              <span>{form.watch("personalInfo.location")}</span>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1 flex flex-wrap justify-center gap-x-4">
            {form.watch("personalInfo.portfolio") && (
              <span>{form.watch("personalInfo.portfolio")}</span>
            )}
            {form.watch("personalInfo.linkedin") && (
              <span>{form.watch("personalInfo.linkedin")}</span>
            )}
          </div>
        </div>

        {form.watch("summary") && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b-2 border-custom-purple pb-1 mb-3">Professional Summary</h2>
            <p className="text-sm leading-relaxed">{form.watch("summary")}</p>
          </div>
        )}

        {form.watch("experiences").some(exp => exp.company || exp.position) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b-2 border-custom-purple pb-1 mb-3">Experience</h2>
            {form.watch("experiences")
              .filter(exp => exp.company || exp.position)
              .map((exp, i) => (
                <div key={i} className="mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium">{exp.position} - {exp.company}</h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{exp.description}</p>
                </div>
              ))}
          </div>
        )}

        {form.watch("education").some(edu => edu.institution || edu.degree) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b-2 border-custom-purple pb-1 mb-3">Education</h2>
            {form.watch("education")
              .filter(edu => edu.institution || edu.degree)
              .map((edu, i) => (
                <div key={i} className="mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""} - {edu.institution}</h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {edu.startDate} - {edu.current ? "Expected" : edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {form.watch("skills").filter(skill => skill.trim() !== "").length > 0 && (
          <div>
            <h2 className="text-lg font-semibold border-b-2 border-custom-purple pb-1 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {form.watch("skills")
                .filter(skill => skill.trim() !== "")
                .map((skill, i) => (
                  <span 
                    key={i} 
                    className="bg-gradient-to-r from-custom-purple/10 to-custom-blue-bright/10 border border-custom-purple/20 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:shadow-md"
                  >
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

export default ResumePreviewSection;
