import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { DVSA_SKILLS, DVSA_SKILLS_BY_SECTION, Session, SkillRating } from "@/lib/drivingSkills";
import { SkillSelector } from "./SkillSelector";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SessionFormProps {
  onClose: () => void;
  onSave: (session: Session) => void;
}

export const SessionForm = ({ onClose, onSave }: SessionFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState("");
  const [instructor, setInstructor] = useState("");
  const [location, setLocation] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [weatherConditions, setWeatherConditions] = useState("");
  const [focusSkills, setFocusSkills] = useState<string[]>([]);
  const [skills, setSkills] = useState<SkillRating[]>(
    DVSA_SKILLS.map(skill => ({ name: skill, rating: 0, notes: "", isFocus: false }))
  );
  const [showOptionalSkills, setShowOptionalSkills] = useState(false);

  const problemAreas = ["Junctions - observing", "Roundabouts", "Reverse park - control"];

  const handleSkillRating = (skillIndex: number, rating: number) => {
    setSkills(prev => prev.map((skill, index) => 
      index === skillIndex ? { ...skill, rating } : skill
    ));
  };

  const handleSkillNotes = (skillIndex: number, notes: string) => {
    setSkills(prev => prev.map((skill, index) => 
      index === skillIndex ? { ...skill, notes } : skill
    ));
  };

  const handleFocusSkillsChange = (selectedSkills: string[]) => {
    setFocusSkills(selectedSkills);
    setSkills(prev => prev.map(skill => ({
      ...skill,
      isFocus: selectedSkills.includes(skill.name)
    })));
  };

  const handleSave = () => {
    const session: Session = {
      id: Date.now().toString(),
      date,
      duration: parseInt(duration) || 0,
      instructor,
      location,
      skills,
      generalNotes,
      weatherConditions,
      focusSkills
    };
    
    onSave(session);
  };

  const isFormValid = date && duration && parseInt(duration) > 0 && focusSkills.length >= 3;

  const focusSkillsData = skills.filter(skill => skill.isFocus);
  const optionalSkillsData = skills.filter(skill => !skill.isFocus);

  const renderSkillSection = (sectionSkills: SkillRating[], title: string) => (
    <div className="space-y-4">
      {sectionSkills.map((skill, index) => {
        const originalIndex = skills.findIndex(s => s.name === skill.name);
        const isProblemArea = problemAreas.includes(skill.name);
        
        return (
          <div
            key={skill.name}
            className={`p-4 border rounded-lg ${
              isProblemArea ? "border-orange-200 bg-orange-50" : 
              skill.isFocus ? "border-blue-200 bg-blue-50" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{skill.name}</span>
                {isProblemArea && (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
                {skill.isFocus && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                    FOCUS
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleSkillRating(originalIndex, star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= skill.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    />
                  </button>
                ))}
                {skill.rating > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSkillRating(originalIndex, 0)}
                    className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <Textarea
              placeholder="Notes about this skill..."
              value={skill.notes}
              onChange={(e) => handleSkillNotes(originalIndex, e.target.value)}
              className="mt-2 text-sm"
              rows={2}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log New Driving Session</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instructor">Instructor (optional)</Label>
                  <Input
                    id="instructor"
                    placeholder="e.g., John Smith"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    placeholder="e.g., City center"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="weather">Weather Conditions (optional)</Label>
                <Input
                  id="weather"
                  placeholder="e.g., Sunny, light traffic"
                  value={weatherConditions}
                  onChange={(e) => setWeatherConditions(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Focus Skills Selection */}
          <SkillSelector
            selectedSkills={focusSkills}
            onSkillsChange={handleFocusSkillsChange}
            minRequired={3}
          />

          {/* Focus Skills Rating */}
          {focusSkillsData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Focus Skills Assessment</CardTitle>
                <p className="text-sm text-gray-600">
                  Rate the skills you focused on during this session.
                </p>
              </CardHeader>
              <CardContent>
                {renderSkillSection(focusSkillsData, "Focus Skills")}
              </CardContent>
            </Card>
          )}

          {/* Optional Skills */}
          <Collapsible open={showOptionalSkills} onOpenChange={setShowOptionalSkills}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Additional Skills (Optional)</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {optionalSkillsData.filter(s => s.rating > 0).length} rated
                      </span>
                      {showOptionalSkills ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Rate any other skills you practiced during this session.
                  </p>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-6">
                  {renderSkillSection(optionalSkillsData, "Additional Skills")}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* General Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">General Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Overall session notes, observations, what to work on next time..."
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isFormValid}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
