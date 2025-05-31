
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Target, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DVSA_SKILLS_BY_SECTION } from "@/lib/drivingSkills";

interface SkillSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  minRequired?: number;
}

export const SkillSelector = ({ 
  selectedSkills, 
  onSkillsChange, 
  minRequired = 3 
}: SkillSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const filteredSections = Object.entries(DVSA_SKILLS_BY_SECTION).reduce((acc, [section, skills]) => {
    const filteredSkills = skills.filter(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredSkills.length > 0) {
      acc[section] = filteredSkills;
    }
    return acc;
  }, {} as Record<string, string[]>);

  const handleSkillToggle = (skill: string) => {
    const newSelection = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    onSkillsChange(newSelection);
  };

  const selectAll = () => {
    const allSkills = Object.values(filteredSections).flat();
    onSkillsChange(allSkills);
  };

  const clearAll = () => {
    onSkillsChange([]);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Select Focus Skills
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {selectedSkills.length} / {minRequired} minimum
                </div>
                {isOpen ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </div>
            </div>
            {selectedSkills.length < minRequired && (
              <p className="text-sm text-orange-600">
                Please select at least {minRequired} skills to focus on during this session.
              </p>
            )}
          </CardHeader>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(filteredSections).map(([section, skills]) => (
                <div key={section}>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                    {section}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <label
                          htmlFor={skill}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {searchTerm && Object.keys(filteredSections).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No skills found matching "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
