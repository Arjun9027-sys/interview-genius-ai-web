
import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/components/resume/types";

interface ResumePreviewSectionProps {
  form: UseFormReturn<ResumeFormValues>;
}

const ResumePreviewSection = ({ form }: ResumePreviewSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Resume Preview</h2>
      <div className="p-6 border rounded-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{form.watch("personalInfo.fullName") || "Your Name"}</h1>
          <div className="text-sm text-gray-600 mt-2">
            {form.watch("personalInfo.email") && (
              <span className="mr-3">{form.watch("personalInfo.email")}</span>
            )}
            {form.watch("personalInfo.phone") && (
              <span className="mr-3">{form.watch("personalInfo.phone")}</span>
            )}
            {form.watch("personalInfo.location") && (
              <span>{form.watch("personalInfo.location")}</span>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {form.watch("personalInfo.portfolio") && (
              <span className="mr-3">{form.watch("personalInfo.portfolio")}</span>
            )}
            {form.watch("personalInfo.linkedin") && (
              <span>{form.watch("personalInfo.linkedin")}</span>
            )}
          </div>
        </div>

        {form.watch("summary") && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Professional Summary</h2>
            <p className="text-sm">{form.watch("summary")}</p>
          </div>
        )}

        {form.watch("experiences").some(exp => exp.company || exp.position) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h2>
            {form.watch("experiences")
              .filter(exp => exp.company || exp.position)
              .map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium">{exp.position} - {exp.company}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
          </div>
        )}

        {form.watch("education").some(edu => edu.institution || edu.degree) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Education</h2>
            {form.watch("education")
              .filter(edu => edu.institution || edu.degree)
              .map((edu, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""} - {edu.institution}</h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate} - {edu.current ? "Expected" : edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {form.watch("skills").filter(skill => skill.trim() !== "").length > 0 && (
          <div>
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {form.watch("skills")
                .filter(skill => skill.trim() !== "")
                .map((skill, i) => (
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

export default ResumePreviewSection;
