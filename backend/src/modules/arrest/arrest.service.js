const Arrest = require('./arrest.model');
class ArrestService {
  async list({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const [total, data] = await Promise.all([
      Arrest.count({}),
      Arrest.findAll({ order: [['Arrest_Date', 'DESC']], offset, limit }),
    ]);
    return { total, page, limit, data };
  }
  async findById(id) { return Arrest.findByPk(id); }
  async create(data) { return Arrest.create(data); }
  async update(id, data) {
    const [c] = await Arrest.update(data, { where: { Arrest_ID: id } });
    if (!c) return null;
    return Arrest.findByPk(id);
  }
  async delete(id) { return (await Arrest.destroy({ where: { Arrest_ID: id } })) > 0; }
}
module.exports = new ArrestService();
