
import { Button } from "@/components/ui/button";

interface ResumeNavigationProps {
  sections: { id: string; label: string }[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ResumeNavigation = ({ sections, activeSection, setActiveSection }: ResumeNavigationProps) => {
  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto gap-2 pb-2 snap-x">
        {sections.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "outline"}
            className={`px-6 snap-start whitespace-nowrap ${activeSection === item.id ? "bg-custom-purple" : ""}`}
            onClick={() => setActiveSection(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-1 mt-2 rounded-full">
        <div 
          className="bg-custom-purple h-1 rounded-full transition-all duration-300"
          style={{
            width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default ResumeNavigation;
