
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/components/resume/types";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-gradient-to-r from-custom-purple to-custom-blue-bright text-white">
          <FileText className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
        <p className="text-gray-600 mb-6">
          Write a concise overview of your professional background, key skills, and career objectives.
          This section will appear at the top of your resume and is often the first thing employers read.
        </p>
        
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Professional Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly summarize your professional background, key accomplishments, and career goals..."
                  className="min-h-[180px] focus:border-custom-purple focus:ring-custom-purple/20 transition-all duration-300 text-base"
                  maxLength={maxChars}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setCharCount(e.target.value.length);
                  }}
                />
              </FormControl>
              <div className="flex justify-end mt-2 text-sm">
                <span className={`font-medium transition-colors ${
                  charCount > (maxChars * 0.9) 
                    ? (charCount > (maxChars * 0.95) ? "text-red-500" : "text-amber-600") 
                    : "text-gray-500"
                }`}>
                  {charCount}/{maxChars} characters
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SummarySection;
