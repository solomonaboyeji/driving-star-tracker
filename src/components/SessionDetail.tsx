
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, User, MapPin, Calendar, AlertTriangle, CloudSun } from "lucide-react";
import { Session } from "@/lib/drivingSkills";

interface SessionDetailProps {
  session: Session;
  onClose: () => void;
}

export const SessionDetail = ({ session, onClose }: SessionDetailProps) => {
  const problemAreas = ["Junctions - observing", "Roundabouts", "Reverse park - control"];
  
  const ratedSkills = session.skills.filter(skill => skill.rating > 0);
  const average = ratedSkills.length > 0 
    ? ratedSkills.reduce((sum, skill) => sum + skill.rating, 0) / ratedSkills.length 
    : 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />
            {new Date(session.date).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            <Badge variant={average >= 4 ? "default" : average >= 3 ? "secondary" : "destructive"}>
              {average.toFixed(1)} ⭐ Average
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{session.duration} minutes</span>
                </div>
                {session.instructor && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{session.instructor}</span>
                  </div>
                )}
                {session.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{session.location}</span>
                  </div>
                )}
                {session.weatherConditions && (
                  <div className="flex items-center gap-2">
                    <CloudSun className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{session.weatherConditions}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills Assessment</CardTitle>
              <p className="text-sm text-gray-600">
                {ratedSkills.length} skills were practiced and rated in this session
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ratedSkills.map((skill) => {
                  const isProblemArea = problemAreas.includes(skill.name);
                  
                  return (
                    <div
                      key={skill.name}
                      className={`p-4 border rounded-lg ${
                        isProblemArea ? "border-orange-200 bg-orange-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          {isProblemArea && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= skill.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {skill.rating}/5
                          </span>
                        </div>
                      </div>
                      
                      {skill.notes && (
                        <div className="bg-white p-2 rounded border text-sm text-gray-700">
                          {skill.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* General Notes */}
          {session.generalNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{session.generalNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
