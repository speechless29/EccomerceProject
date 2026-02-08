import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const { Client } = pg;

const client = new Client({
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT || 5432,
  database: process.env.RDS_DB_NAME,
});

async function showDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    // List all tables
    console.log("📊 Tables in public schema:");
    const tablesResult = await client.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema='public' ORDER BY table_name;`,
    );

    if (tablesResult.rows.length === 0) {
      console.log("  (No tables found)");
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`  ✓ ${row.table_name}`);
      });
    }

    console.log("\n📦 Sample Orders (first 5):");
    const ordersResult = await client.query(
      `SELECT id, "orderTimeMs", "totalCostCents", products FROM "Orders" LIMIT 5;`,
    );

    if (ordersResult.rows.length === 0) {
      console.log("  (No orders found — run /api/reset to seed data)");
    } else {
      ordersResult.rows.forEach((order) => {
        console.log(`\n  Order ID: ${order.id}`);
        console.log(`  Total Cost: ${order.totalCostCents} cents`);
        console.log(`  Products: ${JSON.stringify(order.products, null, 2)}`);
      });
    }

    // Count rows in each table
    console.log("\n📈 Row counts:");
    const countResult = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM "Products") as products_count,
        (SELECT COUNT(*) FROM "CartItems") as cartitems_count,
        (SELECT COUNT(*) FROM "Orders") as orders_count,
        (SELECT COUNT(*) FROM "DeliveryOptions") as deliveryoptions_count;
    `);

    const counts = countResult.rows[0];
    console.log(`  Products: ${counts.products_count}`);
    console.log(`  Cart Items: ${counts.cartitems_count}`);
    console.log(`  Orders: ${counts.orders_count}`);
    console.log(`  Delivery Options: ${counts.deliveryoptions_count}`);

    await client.end();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

showDatabase();
