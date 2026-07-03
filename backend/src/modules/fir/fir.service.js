const FIR = require('./fir.model');
class FIRService {
  async list({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const [total, data] = await Promise.all([
      FIR.count({}),
      FIR.findAll({ order: [['FIR_Date', 'DESC']], offset, limit }),
    ]);
    return { total, page, limit, data };
  }
  async findById(id) { return FIR.findByPk(id); }
  async create(data) { return FIR.create(data); }
  async delete(id) { return (await FIR.destroy({ where: { FIR_No: id } })) > 0; }
}
module.exports = new FIRService();
