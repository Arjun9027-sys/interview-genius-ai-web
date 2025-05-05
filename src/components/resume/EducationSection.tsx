
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/components/resume/types";

interface EducationSectionProps {
  form: UseFormReturn<ResumeFormValues>;
}

const EducationSection = ({ form }: EducationSectionProps) => {
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

  return (
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
  );
};

export default EducationSection;
