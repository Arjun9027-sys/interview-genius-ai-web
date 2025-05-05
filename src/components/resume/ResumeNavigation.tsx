
import { Button } from "@/components/ui/button";

interface ResumeNavigationProps {
  sections: { id: string; label: string }[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ResumeNavigation = ({ sections, activeSection, setActiveSection }: ResumeNavigationProps) => {
  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto gap-2 pb-2">
        {sections.map((item) => (
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
  );
};

export default ResumeNavigation;
