import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  console.log('====================================================');
  console.log('  ANTIGRAVITY SUPABASE MIGRATION RUNNER            ');
  console.log('====================================================');

  const migrationPath = path.resolve(process.cwd(), 'supabase', 'migrations', '20260930_init_schema.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error('[Migration Error] Migration file not found at:', migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf-8');
  console.log(`[Migration] Loaded migration: ${path.basename(migrationPath)} (${sql.length} bytes)`);

  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    console.log('[Notice] Live SUPABASE_URL is not set yet in .env.');
    console.log('         1. Create a free project at https://supabase.com');
    console.log('         2. Open the Supabase SQL Editor');
    console.log('         3. Copy & paste the contents of: supabase/migrations/20260930_init_schema.sql');
    console.log('         4. Update SUPABASE_URL and SUPABASE_ANON_KEY in your .env');
    console.log('[Notice] For local development, the built-in local store is automatically ready.');
    return;
  }

  console.log(`[Migration] Target Supabase project: ${supabaseUrl}`);
  console.log('[Migration] Execute the migration directly in your Supabase SQL Editor dashboard:');
  console.log('            https://supabase.com/dashboard/project/_/sql');
}

runMigration().catch((err) => {
  console.error('[Migration Error]', err);
  process.exit(1);
});
