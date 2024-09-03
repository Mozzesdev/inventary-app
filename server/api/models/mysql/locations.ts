import CrudModel from "../../interface/CrudModel";

class LocationModel extends CrudModel {
  constructor() {
    super({
      table: "location",
      searchFields: [
        "name",
        "manager",
        "address",
        "state",
        "zip",
        "street",
        "phone_number",
        "email",
        "note",
      ],
    });
  }
}

const locationModel = new LocationModel();

export default locationModel;
