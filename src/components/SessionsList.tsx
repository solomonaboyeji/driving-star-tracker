
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Calendar, Clock, MapPin, User, Star } from "lucide-react";
import { Session } from "@/lib/drivingSkills";
import { SessionDetail } from "@/components/SessionDetail";

interface SessionsListProps {
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
}

export const SessionsList = ({ sessions, setSessions }: SessionsListProps) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const deleteSession = (sessionId: string) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const getSessionAverage = (session: Session) => {
    const ratedSkills = session.skills.filter(skill => skill.rating > 0);
    if (ratedSkills.length === 0) return 0;
    return ratedSkills.reduce((sum, skill) => sum + skill.rating, 0) / ratedSkills.length;
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h3>
          <p className="text-gray-600 mb-4">Start logging your driving practice sessions to track your progress!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {sessions.map((session) => {
          const average = getSessionAverage(session);
          const skillsRated = session.skills.filter(skill => skill.rating > 0).length;
          
          return (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {new Date(session.date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={average >= 4 ? "default" : average >= 3 ? "secondary" : "destructive"}>
                      {average.toFixed(1)} ⭐
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSession(session)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSession(session.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {session.duration} minutes
                  </div>
                  {session.instructor && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      {session.instructor}
                    </div>
                  )}
                  {session.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {session.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4" />
                    {skillsRated} skills rated
                  </div>
                </div>
                
                {session.generalNotes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{session.generalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSession && (
        <SessionDetail
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </>
  );
};
