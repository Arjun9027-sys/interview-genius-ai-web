
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { FileText, Plus, Trash2 } from "lucide-react";

// Define the form schema with zod
const resumeFormSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional(),
    location: z.string().optional(),
    portfolio: z.string().url({ message: "Invalid URL." }).optional().or(z.string().length(0)),
    linkedin: z.string().url({ message: "Invalid LinkedIn URL." }).optional().or(z.string().length(0)),
  }),
  summary: z.string().optional(),
  experiences: z.array(
    z.object({
      company: z.string().min(1, "Company name is required"),
      position: z.string().min(1, "Position is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      description: z.string().optional(),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string().min(1, "Institution name is required"),
      degree: z.string().min(1, "Degree is required"),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
    })
  ),
  skills: z.array(z.string()),
});

type ResumeFormValues = z.infer<typeof resumeFormSchema>;

interface ResumeFormProps {
  onSave: (data: ResumeFormValues) => void;
  selectedTemplate: string;
}

const ResumeForm = ({ onSave, selectedTemplate }: ResumeFormProps) => {
  const [activeSection, setActiveSection] = useState<string>("personalInfo");
  
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

  // Function to add a new experience
  const addExperience = () => {
    const experiences = form.getValues("experiences");
    form.setValue("experiences", [
      ...experiences,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  // Function to remove an experience
  const removeExperience = (index: number) => {
    const experiences = form.getValues("experiences");
    if (experiences.length > 1) {
      experiences.splice(index, 1);
      form.setValue("experiences", [...experiences]);
    }
  };

  // Function to add a new education
  const addEducation = () => {
    const education = form.getValues("education");
    form.setValue("education", [
      ...education,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        current: false,
      },
    ]);
  };

  // Function to remove an education
  const removeEducation = (index: number) => {
    const education = form.getValues("education");
    if (education.length > 1) {
      education.splice(index, 1);
      form.setValue("education", [...education]);
    }
  };

  // Function to add a new skill
  const addSkill = () => {
    const skills = form.getValues("skills");
    form.setValue("skills", [...skills, ""]);
  };

  // Function to remove a skill
  const removeSkill = (index: number) => {
    const skills = form.getValues("skills");
    if (skills.length > 1) {
      skills.splice(index, 1);
      form.setValue("skills", [...skills]);
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
      <div className="mb-8">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {resumeNavigation.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "outline"}
              className={activeSection === item.id ? "bg-custom-purple" : ""}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          {activeSection === "personalInfo" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="personalInfo.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="555-123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.portfolio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio/Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourportfolio.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Professional Summary Section */}
          {activeSection === "summary" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Professional Summary</h2>
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly summarize your professional background and goals..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Work Experience Section */}
          {activeSection === "experiences" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Work Experience</h2>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addExperience}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} /> Add Experience
                </Button>
              </div>

              {form.watch("experiences").map((_, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Experience {index + 1}</h3>
                    {form.watch("experiences").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company*</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position*</FormLabel>
                          <FormControl>
                            <Input placeholder="Job Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date*</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YYYY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YYYY or Present" 
                              {...field} 
                              disabled={form.watch(`experiences.${index}.current`)} 
                              value={form.watch(`experiences.${index}.current`) ? "Present" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`experiences.${index}.current`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">I currently work here</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experiences.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your responsibilities and achievements..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Education Section */}
          {activeSection === "education" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Education</h2>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addEducation}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} /> Add Education
                </Button>
              </div>

              {form.watch("education").map((_, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Education {index + 1}</h3>
                    {form.watch("education").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution*</FormLabel>
                          <FormControl>
                            <Input placeholder="University or School Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree*</FormLabel>
                          <FormControl>
                            <Input placeholder="Bachelor's, Master's, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`education.${index}.fieldOfStudy`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Study</FormLabel>
                          <FormControl>
                            <Input placeholder="Computer Science, Business, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`education.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date*</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YYYY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`education.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YYYY or Expected" 
                              {...field} 
                              disabled={form.watch(`education.${index}.current`)}
                              value={form.watch(`education.${index}.current`) ? "Expected" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`education.${index}.current`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Currently attending</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Skills Section */}
          {activeSection === "skills" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Skills</h2>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addSkill}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} /> Add Skill
                </Button>
              </div>
              
              <div className="space-y-4">
                {form.watch("skills").map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`skills.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Enter a skill (e.g., JavaScript, Project Management)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch("skills").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Section */}
          {activeSection === "preview" && (
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
          )}

          {/* Save Button */}
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
