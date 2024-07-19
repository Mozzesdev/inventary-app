import CrudModel from "../../interface/CrudModel";

class RoleModel extends CrudModel {
  constructor() {
    super({
      table: "roles",
      searchFields: ["name", "color", "created_at"],
      id: "name",
      withFiles: false,
    });
  }
}

const roleModel = new RoleModel();

export default roleModel;
