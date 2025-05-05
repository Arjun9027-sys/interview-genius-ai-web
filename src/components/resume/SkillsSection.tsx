
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/components/resume/types";

interface SkillsSectionProps {
  form: UseFormReturn<ResumeFormValues>;
}

const SkillsSection = ({ form }: SkillsSectionProps) => {
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

  return (
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
  );
};

export default SkillsSection;
