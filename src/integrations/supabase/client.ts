import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const TEST_SUPABASE_URL = "https://czdvdbxtmxmrhwfyicpn.supabase.co";
const TEST_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZHZkYnh0bXhtcmh3ZnlpY3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTk4MzUsImV4cCI6MjA2NDIzNTgzNX0.CLYbHXO52CAospfOX1g668eIcEFa0yFYKgFW8xlr1gg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

var supabase_publishable_key = TEST_SUPABASE_PUBLISHABLE_KEY
var supabase_url = TEST_SUPABASE_URL

if (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY != undefined) {
    supabase_publishable_key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
}

if (import.meta.env.VITE_SUPABASE_URL != undefined) {
    supabase_url = import.meta.env.VITE_SUPABASE_URL
}

export const supabase = createClient<Database>(supabase_url, supabase_publishable_key);