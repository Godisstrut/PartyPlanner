import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing Supabase environment variables. " +
        "Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file."
    )
}
console.log("Supabase URL:", supabaseUrl, "Anonkey:", supabaseAnonKey)  // Debug log to verify env variable is loaded
export const supabase = createClient(supabaseUrl, supabaseAnonKey);