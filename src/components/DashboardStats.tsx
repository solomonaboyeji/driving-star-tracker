
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, Target } from "lucide-react";
import { Session } from "@/lib/drivingSkills";

interface DashboardStatsProps {
  sessions: Session[];
}

export const DashboardStats = ({ sessions }: DashboardStatsProps) => {
  const totalSessions = sessions.length;
  const totalHours = sessions.reduce((sum, session) => sum + session.duration, 0) / 60;
  
  const recentSessions = sessions.slice(0, 5);
  const averageRating = () => {
    const allRatings = sessions.flatMap(session => 
      session.skills.filter(skill => skill.rating > 0).map(skill => skill.rating)
    );
    if (allRatings.length === 0) return 0;
    return allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
  };

  const skillsImproving = () => {
    if (sessions.length < 2) return 0;
    
    const recent = sessions.slice(0, 3);
    const older = sessions.slice(3, 6);
    
    if (older.length === 0) return 0;
    
    const recentAvg = recent.flatMap(s => s.skills.filter(sk => sk.rating > 0).map(sk => sk.rating));
    const olderAvg = older.flatMap(s => s.skills.filter(sk => sk.rating > 0).map(sk => sk.rating));
    
    if (recentAvg.length === 0 || olderAvg.length === 0) return 0;
    
    const recentScore = recentAvg.reduce((a, b) => a + b, 0) / recentAvg.length;
    const olderScore = olderAvg.reduce((a, b) => a + b, 0) / olderAvg.length;
    
    return recentScore > olderScore ? 1 : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions}</div>
          <p className="text-xs text-muted-foreground">
            Practice sessions logged
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            Hours of practice
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating().toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            Out of 5 stars
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress Trend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {skillsImproving() ? "↗️" : "📈"}
          </div>
          <p className="text-xs text-muted-foreground">
            {skillsImproving() ? "Improving" : "Steady progress"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
