import CrudModel from "../CrudModel.js";

class DeviceModel extends CrudModel {
  constructor() {
    super({
      table: "device",
      searchFields: [
        "device",
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
      ],
    });
  }
}

const deviceModel = new DeviceModel();

export default deviceModel;
