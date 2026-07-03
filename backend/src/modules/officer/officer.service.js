const Officer = require('./officer.model');

class OfficerService {
  async list({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const [total, data] = await Promise.all([
      Officer.count({}),
      Officer.findAll({ order: [['Officer_ID', 'DESC']], offset, limit }),
    ]);
    return { total, page, limit, data };
  }
  async findById(id) { return Officer.findByPk(id); }
  async create(data) { return Officer.create(data); }
  async update(id, data) {
    const [c] = await Officer.update(data, { where: { Officer_ID: id } });
    if (!c) return null;
    return Officer.findByPk(id);
  }
  async delete(id) { return (await Officer.destroy({ where: { Officer_ID: id } })) > 0; }
}
module.exports = new OfficerService();
