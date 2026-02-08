import { Sequelize } from "sequelize";

const dbType = process.env.DB_TYPE || "postgres";
const defaultPorts = {
  mysql: 3306,
  postgres: 5432,
};
const defaultPort = defaultPorts[dbType];

// Debug: Log what's being loaded
console.log("🔧 Database Config:");
console.log("  DB_TYPE:", process.env.DB_TYPE);
console.log("  RDS_HOSTNAME:", process.env.RDS_HOSTNAME);
console.log("  RDS_PORT:", process.env.RDS_PORT);
console.log("  RDS_DB_NAME:", process.env.RDS_DB_NAME);
console.log("  RDS_USERNAME:", process.env.RDS_USERNAME);
console.log("  RDS_PASSWORD:", process.env.RDS_PASSWORD ? "****" : "UNDEFINED");

export const sequelize = new Sequelize({
  database: process.env.RDS_DB_NAME,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT || defaultPort,
  dialect: dbType,
  logging: false,
});
