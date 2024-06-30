export interface Model {
  getAll(params: any);

  getById(params: any);

  create(body: any);

  update(body: any);

  delete(body: any);
}
