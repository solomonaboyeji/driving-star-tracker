
export const DVSA_SKILLS = [
  // Eyesight test
  "Eyesight test",
  
  // Vehicle safety questions
  "Vehicle safety questions",
  
  // Controlled stop
  "Controlled stop",
  
  // Moving off
  "Moving off - safely",
  "Moving off - control",
  
  // Reversing
  "Reverse park - control",
  "Reverse park - accuracy",
  
  // Forward parking
  "Forward park",
  
  // Use of mirrors
  "Use of mirrors - signalling",
  "Use of mirrors - changing direction",
  "Use of mirrors - speed",
  
  // Signalling
  "Signalling - necessary",
  "Signalling - correctly",
  "Signalling - timed",
  
  // Acting on signs/signals
  "Response to signs - traffic signs",
  "Response to signs - road markings",
  "Response to signs - traffic lights",
  "Response to signs - other road users",
  
  // Making progress
  "Making progress",
  "Driving too slowly",
  
  // Controlling speed
  "Control of speed",
  
  // Following distance
  "Following distance",
  
  // Positioning
  "Positioning - normal driving",
  "Positioning - lane discipline",
  
  // Junctions
  "Junctions - observing",
  "Junctions - turning right",
  "Junctions - turning left",
  
  // Roundabouts
  "Roundabouts"
];

export interface SkillRating {
  name: string;
  rating: number; // 1-5 stars, 0 for not practiced
  notes?: string;
}

export interface Session {
  id: string;
  date: string;
  duration: number; // minutes
  instructor?: string;
  location?: string;
  skills: SkillRating[];
  generalNotes?: string;
  weatherConditions?: string;
}
