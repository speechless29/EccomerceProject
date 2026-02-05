import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

async function verifyPostgresConnection() {
  const client = new Client({
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME,
  });

  try {
    console.log("🔌 Attempting to connect to PostgreSQL...");
    console.log(`   Host: ${process.env.RDS_HOSTNAME}`);
    console.log(`   Port: ${process.env.RDS_PORT}`);
    console.log(`   Database: ${process.env.RDS_DB_NAME}`);
    console.log(`   User: ${process.env.RDS_USERNAME}`);

    await client.connect();
    console.log("✅ Successfully connected to PostgreSQL!");

    // Check if tables exist
    const result = await client.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema='public' ORDER BY table_name;`,
    );

    console.log("\n📊 Existing Tables:");
    if (result.rows.length === 0) {
      console.log(
        "   (No tables yet - they will be created when you start the server)",
      );
    } else {
      result.rows.forEach((row) => {
        console.log(`   ✓ ${row.table_name}`);
      });
    }

    await client.end();
    console.log("\n🎉 Database connection verified!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(`   ${error.message}`);
    console.log("\n📝 Troubleshooting:");
    console.log("   1. Is PostgreSQL running?");
    console.log("   2. Check your .env file for correct credentials");
    console.log('   3. Make sure database "ecommerce_db" exists');
    process.exit(1);
  }
}

verifyPostgresConnection();
