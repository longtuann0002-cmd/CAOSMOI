import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase environment credentials using safe typing
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

// Safely evaluate if Supabase is properly configured in settings
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  !supabaseUrl.toLowerCase().includes('placeholder') &&
  !supabaseUrl.toLowerCase().includes('your_supabase') &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20 &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE'
);

// Initialize Supabase client
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;


/**
 * Upsert an array of records into a Supabase table.
 * @param table Supabase table name
 * @param records Records to upsert
 * @param onConflict Column to use for upsert conflict resolution
 * @returns Success status indicator
 */
export async function upsertTableData<T>(table: string, records: T[], onConflict: string = 'id'): Promise<boolean> {
  if (!supabase) return false;
  if (!Array.isArray(records)) return false;
  if (records.length === 0) return true;

  try {
    const { error } = await supabase
      .from(table)
      .upsert(records, { onConflict });

    if (error) {
      console.warn(`[Supabase] Upsert failed for table "${table}":`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[Supabase] Exception upserting table "${table}":`, err);
    return false;
  }
}

/**
 * Fetch all records from a Supabase table.
 * @param table Supabase table name
 * @returns Array of records or null if unavailable
 */
export async function fetchTableData<T>(table: string): Promise<T[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');

    if (error) {
      console.warn(`[Supabase] Fetch failed for table "${table}":`, error.message);
      return null;
    }

    return data || [];
  } catch (err) {
    console.error(`[Supabase] Exception fetching table "${table}":`, err);
    return null;
  }
}
