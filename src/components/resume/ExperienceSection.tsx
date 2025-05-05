
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/components/resume/types";

interface ExperienceSectionProps {
  form: UseFormReturn<ResumeFormValues>;
  isFresher: boolean;
  onFresherToggle: (checked: boolean) => void;
}

const ExperienceSection = ({ form, isFresher, onFresherToggle }: ExperienceSectionProps) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        {!isFresher && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addExperience}
            className="flex items-center gap-1"
          >
            <Plus size={16} /> Add Experience
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
        <Switch 
          id="fresher-mode" 
          checked={isFresher} 
          onCheckedChange={onFresherToggle} 
        />
        <label htmlFor="fresher-mode" className="text-sm font-medium">
          I am a fresher with no work experience
        </label>
      </div>

      {isFresher ? (
        <div className="border p-4 rounded-lg space-y-4 bg-gray-50">
          <h3 className="font-medium">Fresher Status</h3>
          <p className="text-gray-600">
            As a fresher, you can focus on highlighting your education, skills, projects, and any relevant
            coursework or internships. A well-structured resume can showcase your potential even without
            formal work experience.
          </p>
        </div>
      ) : (
        form.watch("experiences").map((_, index) => (
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
        ))
      )}
    </div>
  );
};

export default ExperienceSection;
