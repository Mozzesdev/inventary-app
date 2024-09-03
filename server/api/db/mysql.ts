import mysql, { Pool } from "mysql2/promise";
import { MYSQL_CONFIG } from "../../config";

let mysqlPool: Pool | null = null;

async function getMysqlPool() {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool(JSON.parse(MYSQL_CONFIG!));
  }
  return mysqlPool;
}

export default getMysqlPool;
