const Evidence = require('./evidence.model');
class EvidenceService {
  async list({ page = 1, limit = 10, case_id }) {
    const offset = (page - 1) * limit;
    const filter = {};
    if (case_id) filter.Case_ID = case_id;
    const [total, data] = await Promise.all([
      Evidence.count({ where: filter }),
      Evidence.findAll({ where: filter, order: [['Evidence_ID', 'DESC']], offset, limit }),
    ]);
    return { total, page, limit, data };
  }
  async findById(id) { return Evidence.findByPk(id); }
  async create(data) { return Evidence.create(data); }
  async update(id, data) {
    const [c] = await Evidence.update(data, { where: { Evidence_ID: id } });
    if (!c) return null;
    return Evidence.findByPk(id);
  }
  async delete(id) { return (await Evidence.destroy({ where: { Evidence_ID: id } })) > 0; }
}
module.exports = new EvidenceService();
