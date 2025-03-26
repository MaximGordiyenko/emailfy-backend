
// Example query
import supabase from './config/supabase.js';

const { data, error } = await supabase
  .from('Account')
  .select('*')
