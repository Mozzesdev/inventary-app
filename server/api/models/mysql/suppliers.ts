import CrudModel from "../../interface/CrudModel.js";

class SuppliersModel extends CrudModel {
  constructor() {
    super({
      table: "supplier",
      searchFields: [
        "name",
        "contact",
        "address",
        "state",
        "zip",
        "street",
        "phone_number",
        "email",
        "web_page",
        "note",
      ],
    });
  }
}

const supplierModel = new SuppliersModel();

export default supplierModel;
