
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/components/resume/types";

interface PersonalInfoSectionProps {
  form: UseFormReturn<ResumeFormValues>;
}

const PersonalInfoSection = ({ form }: PersonalInfoSectionProps) => {
  return (
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
  );
};

export default PersonalInfoSection;
