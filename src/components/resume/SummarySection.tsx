
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/components/resume/types";

interface SummarySectionProps {
  form: UseFormReturn<ResumeFormValues>;
}

const SummarySection = ({ form }: SummarySectionProps) => {
  return (
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
  );
};

export default SummarySection;
