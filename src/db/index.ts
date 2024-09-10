import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "db1234db@",
  database: "drizzle-db",
});

const db = drizzle(pool);

async function main() {
  try {
    await pool.connect();
    console.log('DB is connected properly');

    // Run migrations
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations have been applied');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();

export default db;