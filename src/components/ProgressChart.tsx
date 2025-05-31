
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Session, DVSA_SKILLS } from "@/lib/drivingSkills";
import { Star, AlertTriangle } from "lucide-react";

interface ProgressChartProps {
  sessions: Session[];
}

export const ProgressChart = ({ sessions }: ProgressChartProps) => {
  const problemAreas = ["Junctions - observing", "Roundabouts", "Reverse park - control"];

  // Prepare data for overall progress chart
  const progressData = sessions
    .slice(0, 10)
    .reverse()
    .map((session, index) => {
      const sessionAverage = session.skills
        .filter(skill => skill.rating > 0)
        .reduce((sum, skill) => sum + skill.rating, 0) / 
        Math.max(1, session.skills.filter(skill => skill.rating > 0).length);
      
      return {
        session: `Session ${index + 1}`,
        date: new Date(session.date).toLocaleDateString(),
        average: sessionAverage || 0
      };
    });

  // Get current averages for all skills
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

  const skillsData = DVSA_SKILLS.map(skill => ({
    name: skill,
    average: getSkillAverage(skill),
    isProblemArea: problemAreas.includes(skill)
  })).sort((a, b) => a.average - b.average);

  return (
    <div className="space-y-6">
      {/* Overall Progress Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {progressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value: any) => [`${value.toFixed(1)} stars`, "Average Rating"]}
                  labelFormatter={(label) => {
                    const sessionData = progressData.find(d => d.session === label);
                    return sessionData ? `${label} (${sessionData.date})` : label;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              <p>No sessions recorded yet. Start logging your practice sessions!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Breakdown</CardTitle>
          <p className="text-sm text-gray-600">
            Current average rating for each skill (skills with 🔺 need extra focus)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {skillsData.map((skill) => (
              <div
                key={skill.name}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  skill.isProblemArea 
                    ? "border-orange-200 bg-orange-50" 
                    : skill.average < 3 
                    ? "border-red-200 bg-red-50"
                    : skill.average >= 4
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  {skill.isProblemArea && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= skill.average
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 min-w-[3rem] text-right">
                    {skill.average > 0 ? skill.average.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
