
-- Create a table for driving sessions
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL,
  instructor TEXT,
  location TEXT,
  general_notes TEXT,
  weather_conditions TEXT,
  focus_skills JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own sessions
CREATE POLICY "Users can create their own sessions" 
  ON public.sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own sessions
CREATE POLICY "Users can update their own sessions" 
  ON public.sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own sessions
CREATE POLICY "Users can delete their own sessions" 
  ON public.sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);
