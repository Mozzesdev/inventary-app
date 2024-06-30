import { RowDataPacket, FieldPacket } from "mysql2";
import getConnection from "../db/mysql.js";

interface Pagination {
  page: number;
  perPage: number;
  total: number;
  allPages: number;
}

interface QueryOptions {
  page?: number;
  perPage?: number;
  query?: string;
}

interface BaseModelConstructorOptions {
  table: string;
  searchFields: string[];
  references?: Ref[];
}

interface Ref {
  field: string;
  table: string;
}

class CrudModel {
  table: string;
  searchFields: string[];
  references?: Ref[];

  constructor({
    table,
    searchFields,
    references,
  }: BaseModelConstructorOptions) {
    this.table = table;
    this.searchFields = searchFields;
    this.references = references;
  }

  async getAll({ page = 1, perPage = 10, query = "" }: QueryOptions = {}) {
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

    let likeClauses = "";
    if (query) {
      likeClauses = this.searchFields
        .map((field) => `${field} LIKE ?`)
        .join(" OR ");
      sqlQuery += ` WHERE ${likeClauses}`;
      this.searchFields.forEach(() => params.push(`%${query}%`));
    }
    sqlQuery += " LIMIT ? OFFSET ?";

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
                record[ref.table] = refMap[record[ref.field]] || null;
                delete record[ref.field];
              });
            }
          }
        }

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

      const countQuery = query
        ? `SELECT COUNT(*) as count FROM ${this.table} WHERE ${likeClauses}`
        : `SELECT COUNT(*) as count FROM ${this.table}`;
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

  async getById({ id }: { id: string }) {
    try {
      const mysqlConnection = await getConnection();

      const [[locationRecords]]: [RowDataPacket[], FieldPacket[]] =
        await mysqlConnection.query(
          `SELECT *, BIN_TO_UUID(id) as id FROM ${this.table} WHERE id = UUID_TO_BIN(?);`,
          [id]
        );

      if (!locationRecords) {
        return { success: false, message: "Record not found" };
      }

      const [fileRecords]: [RowDataPacket[], FieldPacket[]] =
        await mysqlConnection.query(
          `SELECT *, BIN_TO_UUID(id) as id, BIN_TO_UUID(${this.table}_id) as ${this.table}_id FROM ${this.table}_files WHERE ${this.table}_id = UUID_TO_BIN(?);`,
          [id]
        );

      const result = {
        ...locationRecords,
        files: fileRecords,
      };

      return { success: true, data: result };
    } catch (error) {
      console.error(`Error fetching record by id from ${this.table}:`, error);
      return {
        success: false,
        message: `Error fetching record by id from ${this.table}`,
      };
    }
  }

  async create({ input }: { input: Record<string, any> }) {
    try {
      const mysqlConnection = await getConnection();

      const { files, ...inputData } = input;

      const values: any = {};

      for (const field of this.searchFields) {
        if (Object.prototype.hasOwnProperty.call(inputData, field)) {
          const value = inputData[field];
          values[field] = value;
        }
      }

      const fields = Object.keys(values).join(", ");
      const placeholders = Object.keys(values)
        .map((key) => (key.includes("id") ? "UUID_TO_BIN(?)" : "?"))
        .join(", ");
      const finalValues = Object.values(values);

      const [uuidResult]: [RowDataPacket[], FieldPacket[]] =
        await mysqlConnection.query("SELECT UUID() AS uuid;");

      const [{ uuid }] = uuidResult as [{ uuid: string }];

      await mysqlConnection.query(
        `INSERT INTO ${this.table} (id, ${fields}) VALUES (UUID_TO_BIN(?), ${placeholders});`,
        [uuid, ...finalValues]
      );

      if (files && files.length) {
        const fileInserts = files.map((file: Record<string, any>) => {
          return mysqlConnection.query(
            `INSERT INTO ${this.table}_files (${this.table}_id, name, url, size, created_at, type) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?);`,
            [uuid, file.name, file.url, file.size, file.created_at, file.type]
          );
        });
        await Promise.all(fileInserts);
      }

      return { success: true, data: [], statusCode: 200 };
    } catch (error) {
      console.error(`Error creating record in ${this.table}:`, error);
      return {
        success: false,
        message: `Error creating record in ${this.table}`,
        statusCode: 500,
      };
    }
  }

  async delete({ id }: { id: string }) {
    try {
      const mysqlConnection = await getConnection();

      await mysqlConnection.query(
        `DELETE FROM ${this.table}_files WHERE ${this.table}_id = UUID_TO_BIN(?);`,
        [id]
      );

      await mysqlConnection.query(
        `DELETE FROM ${this.table} WHERE id = UUID_TO_BIN(?);`,
        [id]
      );

      return {
        success: true,
        message: "Record deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.error(`Error deleting record from ${this.table}:`, error);
      return {
        success: false,
        message: `Error deleting record from ${this.table}`,
        statusCode: 500,
      };
    }
  }

  async update({ id, input }: { id: string; input: Record<string, any> }) {
    try {
      const mysqlConnection = await getConnection();

      const updateFields = Object.keys(input)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(input);

      await mysqlConnection.query(
        `UPDATE ${this.table} SET ${updateFields} WHERE id = UUID_TO_BIN(?);`,
        [...values, id]
      );

      const [[records]]: [RowDataPacket[], FieldPacket[]] =
        await mysqlConnection.query(
          `SELECT *, BIN_TO_UUID(id) as id FROM ${this.table} WHERE id = UUID_TO_BIN(?);`,
          [id]
        );

      return { success: true, data: records, statusCode: 200 };
    } catch (error) {
      console.error(`Error updating record in ${this.table}:`, error);
      return {
        success: false,
        message: `Error updating record in ${this.table}`,
        statusCode: 500,
      };
    }
  }
}

export default CrudModel;
