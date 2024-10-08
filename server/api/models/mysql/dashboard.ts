import getMysqlPool from "../../db/mysql";
import { Device } from "../../interface/device";

export default class DashboardModel {
  static async getDevices() {
    const query = `SELECT *, BIN_TO_UUID(id) as id, BIN_TO_UUID(supplier_id) as supplier_id FROM device WHERE expiration_date IS NOT NULL ORDER BY expiration_date ASC LIMIT 10;`;

    try {
      const mysqlPool = await getMysqlPool();
      const [rows] = await mysqlPool.query(query);

      const devices: any[] = await Promise.all(
        (rows as Device[]).map(async (device: Device) => {
          if (device.supplier_id) {
            const supplierQuery = `SELECT BIN_TO_UUID(id) as id, name FROM supplier WHERE id = UUID_TO_BIN(?);`;
            const [supplierRows] = await mysqlPool.query(supplierQuery, [
              device.supplier_id,
            ]);
            const supplier: any = (supplierRows as any[])[0];
            return {
              ...device,
              supplier,
            };
          } else {
            return {
              ...device,
              supplier: null,
            };
          }
        })
      );

      return {
        success: true,
        statusCode: 200,
        data: devices,
        message: "Get devices successful",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        statusCode: 500,
        message: "Error when getting devices.",
      };
    }
  }

  static async getCounters() {
    const mainDevicesQuery =
      "SELECT COUNT(*) as main_devices_count FROM device WHERE maintenance_date IS NOT NULL;";
    const locationsQuery = "SELECT COUNT(*) as location_count FROM location;";
    const devicesQuery = "SELECT COUNT(*) as devices_count FROM device;";
    const suppliersQuery = "SELECT COUNT(*) as supplier_count FROM supplier;";

    try {
      const mysqlPool = await getMysqlPool();

      const [mainDevicesRows, locationsRows, devicesRows, suppliersRows] =
        await Promise.all([
          mysqlPool.query(mainDevicesQuery),
          mysqlPool.query(locationsQuery),
          mysqlPool.query(devicesQuery),
          mysqlPool.query(suppliersQuery),
        ]);

      const mainDevicesCount = mainDevicesRows[0][0].main_devices_count;
      const locationCount = locationsRows[0][0].location_count;
      const devicesCount = devicesRows[0][0].devices_count;
      const supplierCount = suppliersRows[0][0].supplier_count;

      return {
        success: true,
        statusCode: 200,
        data: {
          mainDevicesCount,
          locationCount,
          devicesCount,
          supplierCount,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: 500,
        message: "Error getting counters.",
      };
    }
  }
}
