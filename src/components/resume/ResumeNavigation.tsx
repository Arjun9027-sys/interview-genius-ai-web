
import { Button } from "@/components/ui/button";

interface ResumeNavigationProps {
  sections: { id: string; label: string }[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ResumeNavigation = ({ sections, activeSection, setActiveSection }: ResumeNavigationProps) => {
  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto gap-3 pb-3 snap-x">
        {sections.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "outline"}
            className={`px-6 py-5 snap-start whitespace-nowrap rounded-full shadow-sm hover:shadow-md transition-all duration-300 ${
              activeSection === item.id 
                ? "bg-gradient-to-r from-custom-purple to-custom-blue-bright text-white font-medium" 
                : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-custom-purple to-custom-blue-bright h-2 rounded-full transition-all duration-500"
          style={{
            width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default ResumeNavigation;
