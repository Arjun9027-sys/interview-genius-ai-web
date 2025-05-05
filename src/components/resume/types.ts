
import { z } from "zod";

// Define the form schema with zod
export const resumeFormSchema = z.object({
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

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;
