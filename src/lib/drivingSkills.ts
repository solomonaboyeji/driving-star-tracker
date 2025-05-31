export const DVSA_SKILLS_BY_SECTION = {
  "Pre-driving Checks": [
    "Eyesight test",
    "Vehicle safety questions"
  ],
  "Vehicle Control": [
    "Controlled stop",
    "Moving off - safely", 
    "Moving off - control"
  ],
  "Maneuvering": [
    "Reverse park - control",
    "Reverse park - accuracy",
    "Forward park"
  ],
  "Observation": [
    "Use of mirrors - signalling",
    "Use of mirrors - changing direction", 
    "Use of mirrors - speed"
  ],
  "Signalling": [
    "Signalling - necessary",
    "Signalling - correctly",
    "Signalling - timed"
  ],
  "Response to Signs": [
    "Response to signs - traffic signs",
    "Response to signs - road markings",
    "Response to signs - traffic lights", 
    "Response to signs - other road users"
  ],
  "Speed & Progress": [
    "Making progress",
    "Driving too slowly",
    "Control of speed",
    "Following distance"
  ],
  "Positioning": [
    "Positioning - normal driving",
    "Positioning - lane discipline"
  ],
  "Junctions": [
    "Junctions - observing",
    "Junctions - turning right",
    "Junctions - turning left"
  ],
  "Roundabouts": [
    "Roundabouts"
  ]
};

// Keep the flat array for backward compatibility
export const DVSA_SKILLS = Object.values(DVSA_SKILLS_BY_SECTION).flat();

export interface SkillRating {
  name: string;
  rating: number; // 1-5 stars, 0 for not practiced
  notes?: string;
  isFocus?: boolean; // New field to mark focus skills
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
  focusSkills: string[]; // New field to store selected focus skills
}
