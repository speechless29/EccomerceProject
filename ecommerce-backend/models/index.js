import { Sequelize } from "sequelize";

const dbType = process.env.DB_TYPE || "postgres";
const defaultPorts = {
  mysql: 3306,
  postgres: 5432,
};
const defaultPort = defaultPorts[dbType];

export const sequelize = new Sequelize({
  database: process.env.RDS_DB_NAME,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT || defaultPort,
  dialect: dbType,
  logging: false,
});
