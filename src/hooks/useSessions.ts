
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@/lib/drivingSkills";
import { useToast } from "@/hooks/use-toast";

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      // Transform database data to match the Session interface
      const transformedSessions: Session[] = data.map((session) => ({
        id: session.id,
        date: session.date,
        duration: session.duration,
        instructor: session.instructor || "",
        location: session.location || "",
        skills: session.skills || [],
        generalNotes: session.general_notes || "",
        weatherConditions: session.weather_conditions || "",
        focusSkills: session.focus_skills || [],
      }));

      setSessions(transformedSessions);
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async (session: Session) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("sessions").insert({
        user_id: user.id,
        date: session.date,
        duration: session.duration,
        instructor: session.instructor || null,
        location: session.location || null,
        general_notes: session.generalNotes || null,
        weather_conditions: session.weatherConditions || null,
        focus_skills: session.focusSkills,
        skills: session.skills,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Session saved successfully",
      });

      // Refresh sessions list
      fetchSessions();
    } catch (error: any) {
      console.error("Error saving session:", error);
      toast({
        title: "Error",
        description: "Failed to save session",
        variant: "destructive",
      });
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Session deleted successfully",
      });

      // Refresh sessions list
      fetchSessions();
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    loading,
    saveSession,
    deleteSession,
    refreshSessions: fetchSessions,
  };
};
