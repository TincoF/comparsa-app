import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey,

   { auth: {
      persistSession: false, // 🔥 IMPORTANTE
      autoRefreshToken: false,
      detectSessionInUrl: false
    }}

);
