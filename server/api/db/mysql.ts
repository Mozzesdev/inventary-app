import mysql, { Pool } from "mysql2/promise";
import { MYSQL_CONFIG } from "../../config.js";

let connection: Pool | null = null;

async function getConnection() {
  if (!connection) {
    connection = mysql.createPool(JSON.parse(MYSQL_CONFIG!));
  }
  return connection;
}

export default getConnection;
