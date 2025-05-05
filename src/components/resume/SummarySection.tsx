
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/components/resume/types";
import { useState, useEffect } from "react";

interface SummarySectionProps {
  form: UseFormReturn<ResumeFormValues>;
}

const SummarySection = ({ form }: SummarySectionProps) => {
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;
  
  useEffect(() => {
    setCharCount(form.watch("summary")?.length || 0);
  }, [form.watch("summary")]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Professional Summary</h2>
      <p className="text-gray-600">
        Write a concise overview of your professional background, key skills, and career objectives.
        This section will appear at the top of your resume.
      </p>
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
                maxLength={maxChars}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setCharCount(e.target.value.length);
                }}
              />
            </FormControl>
            <div className="flex justify-end mt-1 text-sm text-gray-500">
              <span className={charCount > (maxChars * 0.9) ? "text-amber-600" : ""}>
                {charCount}/{maxChars}
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SummarySection;
