import { FieldPacket, RowDataPacket } from "mysql2";
import getConnection from "../../db/mysql.js";
import CrudModel, {
  Pagination,
  QueryOptions,
} from "../../interface/CrudModel.js";

class DeviceModel extends CrudModel {
  constructor() {
    super({
      table: "device",
      searchFields: [
        "name",
        "location_id",
        "serial_number",
        "maintenance",
        "brand",
        "type",
        "supplier_id",
        "purchase_date",
        "production_date",
        "expiration_date",
        "note",
        "created_at",
        "maintenance_supplier_id",
      ],
      references: [
        {
          field: "location_id",
          table: "location",
        },
        {
          field: "supplier_id",
          table: "supplier",
        },
        {
          field: "maintenance_supplier_id",
          table: "supplier",
        },
      ],
    });
  }

  async getMaintenances({
    page = 1,
    perPage = 10,
    query = "",
  }: QueryOptions = {}) {
    page = +page;
    perPage = +perPage;
    const params: any[] = [];
    const offset = (page - 1) * perPage;

    let sqlQuery = `SELECT *, BIN_TO_UUID(id) as id${
      this.references?.length
        ? this.references
            .map((ref) =>
              ref.field.includes("id")
                ? `, BIN_TO_UUID(${ref.field}) as ${ref.field}`
                : ref.field
            )
            .join("")
        : ""
    } FROM ${this.table}`;
    const mysqlConnection = await getConnection();

    let whereClauses = ` WHERE maintenance_date IS NOT NULL`;
    let likeClauses = "";

    if (query) {
      likeClauses = this.searchFields
        .map((field) => `${field} LIKE ?`)
        .join(" OR ");
      whereClauses += ` AND (${likeClauses})`;
      this.searchFields.forEach(() => params.push(`%${query}%`));
    }

    sqlQuery += `${whereClauses} LIMIT ? OFFSET ?`;

    params.push(perPage, offset);

    try {
      const [records]: [RowDataPacket[], FieldPacket[]] =
        await mysqlConnection.query(sqlQuery, params);

      if (records?.length) {
        if (this.references?.length) {
          for (const ref of this.references) {
            const refIds = records
              .map((record: any) => record[ref.field])
              .filter((id: any) => id !== null);

            const refIdsBin = refIds.map((uuid: string) =>
              mysqlConnection.format("UUID_TO_BIN(?)", [uuid])
            );

            if (refIds.length > 0) {
              const refQuery = `SELECT BIN_TO_UUID(id) as id, name FROM ${
                ref.table
              } WHERE id IN (${refIdsBin.join(", ")});`;
              const [refRecords]: [RowDataPacket[], FieldPacket[]] =
                await mysqlConnection.query(refQuery);

              const refMap = refRecords.reduce((acc: any, refRecord: any) => {
                acc[refRecord.id] = refRecord;
                return acc;
              }, {});

              records.forEach((record: any) => {
                const refFieldName = ref.field.replace("_id", "");
                record[refFieldName] = refMap[record[ref.field]] || null;
                delete record[ref.field];
              });
            }
          }
        }

        if (this.withFiles) {
          const ids = records.map((record: any) => record.id);
          const fileQuery = `
            SELECT *, BIN_TO_UUID(id) as id, BIN_TO_UUID(${this.table}_id) as ${
            this.table
          }_id
            FROM ${this.table}_files
            WHERE ${this.table}_id IN (${ids
            .map(() => "UUID_TO_BIN(?)")
            .join(", ")})
          `;
          const [fileRecords]: [RowDataPacket[], FieldPacket[]] =
            await mysqlConnection.query(fileQuery, ids);

          const filesMap = fileRecords.reduce((acc: any, file: any) => {
            const tableId = file[`${this.table}_id`];
            if (!acc[tableId]) {
              acc[tableId] = [];
            }
            acc[tableId].push(file);
            return acc;
          }, {});

          records.forEach((record: any) => {
            record.files = filesMap[record.id] || [];
          });
        }
      }

      const countQuery = query
        ? `SELECT COUNT(*) as count FROM ${this.table} WHERE maintenance_date IS NOT NULL AND (${likeClauses})`
        : `SELECT COUNT(*) as count FROM ${this.table} WHERE maintenance_date IS NOT NULL`;
      const countParams = query
        ? this.searchFields.map(() => `%${query}%`)
        : [];

      const [[{ count }]]: [RowDataPacket[], FieldPacket[]] =
        await mysqlConnection.query(countQuery, countParams);

      const pagination: Pagination = {
        page,
        perPage,
        total: count,
        allPages: Math.ceil(count / perPage),
      };

      return { success: true, data: records, pagination, statusCode: 200 };
    } catch (error) {
      console.error(`Error fetching records from ${this.table}:`, error);
      return {
        success: false,
        message: `Error fetching records from ${this.table}`,
        statusCode: 500,
      };
    }
  }
}

const deviceModel = new DeviceModel();

export default deviceModel;
