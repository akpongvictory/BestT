import { createClient } from "@supabase/supabase-js";

import { env } from "../config/env";

if (!env.supabaseUrl) {
  throw new Error(
    "SUPABASE_URL is not configured."
  );
}

if (!env.supabaseServiceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not configured."
  );
}

export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);