
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, AlertTriangle, Star } from "lucide-react";
import { DashboardStats } from "@/components/DashboardStats";
import { SessionForm } from "@/components/SessionForm";
import { ProgressChart } from "@/components/ProgressChart";
import { SessionsList } from "@/components/SessionsList";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Session, DVSA_SKILLS } from "@/lib/drivingSkills";

const Index = () => {
  const [sessions, setSessions] = useLocalStorage<Session[]>("driving-sessions", []);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "progress" | "sessions">("dashboard");

  const problemAreas = ["Junctions - observing", "Roundabouts", "Reverse park - control"];
  
  const getSkillAverage = (skillName: string) => {
    const skillSessions = sessions.filter(session => 
      session.skills.some(skill => skill.name === skillName && skill.rating > 0)
    );
    if (skillSessions.length === 0) return 0;
    
    const total = skillSessions.reduce((sum, session) => {
      const skill = session.skills.find(s => s.name === skillName);
      return sum + (skill?.rating || 0);
    }, 0);
    
    return total / skillSessions.length;
  };

  const overallProgress = () => {
    const allAverages = DVSA_SKILLS.map(skill => getSkillAverage(skill));
    const validAverages = allAverages.filter(avg => avg > 0);
    if (validAverages.length === 0) return 0;
    return validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Driving Progress Tracker
          </h1>
          <p className="text-gray-600">Track your journey to becoming a confident driver</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2"
          >
            <TrendingUp size={16} />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "progress" ? "default" : "outline"}
            onClick={() => setActiveTab("progress")}
            className="flex items-center gap-2"
          >
            <Star size={16} />
            Progress
          </Button>
          <Button
            variant={activeTab === "sessions" ? "default" : "outline"}
            onClick={() => setActiveTab("sessions")}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Sessions
          </Button>
        </div>

        {/* Quick Add Session Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowSessionForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Log New Session
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Overall Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Overall Progress
                </CardTitle>
                <CardDescription>
                  Your average performance across all DVSA skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round((overallProgress() / 5) * 100)}%</span>
                  </div>
                  <Progress value={(overallProgress() / 5) * 100} className="h-3" />
                  <p className="text-sm text-gray-600 mt-2">
                    Average rating: {overallProgress().toFixed(1)}/5 stars
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Problem Areas Card */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Focus Areas (Previous Test Issues)
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Skills that need extra attention based on your last test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {problemAreas.map((skill) => {
                    const average = getSkillAverage(skill);
                    return (
                      <div key={skill} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                        <span className="font-medium text-gray-900">{skill}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= average
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {average > 0 ? average.toFixed(1) : "Not rated"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <DashboardStats sessions={sessions} />
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-6">
            <ProgressChart sessions={sessions} />
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="space-y-6">
            <SessionsList sessions={sessions} setSessions={setSessions} />
          </div>
        )}

        {/* Session Form Modal */}
        {showSessionForm && (
          <SessionForm
            onClose={() => setShowSessionForm(false)}
            onSave={(session) => {
              setSessions(prev => [session, ...prev]);
              setShowSessionForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
