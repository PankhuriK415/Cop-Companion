const { Op } = require('sequelize');
const Case = require('./case.model');
const PoliceStation = require('../station/station.model');
const Officer = require('../officer/officer.model');

class CaseService {
  async list({ page = 1, limit = 10, status, search }) {
    const offset = (page - 1) * limit;
    const filter = {};
    if (status) filter.Case_Status = status;
    if (search) filter.Description = { [Op.like]: `%${search}%` };

    const [total, data] = await Promise.all([
      Case.count({ where: filter }),
      Case.findAll({ where: filter, order: [['Case_Date', 'DESC']], offset, limit }),
    ]);

    return { total, page, limit, data };
  }

  async findById(id) {
    const row = await Case.findByPk(id);
    if (!row) return null;

    const station = row.Station_ID ? await PoliceStation.findByPk(row.Station_ID) : null;
    const officer = row.Officer_ID ? await Officer.findByPk(row.Officer_ID) : null;

    return {
      ...row.get(),
      Station_ID: station,
      Officer_ID: officer,
    };
  }

  async create(data) {
    return Case.create(data);
  }

  async update(id, data) {
    const [updatedCount] = await Case.update(data, { where: { Case_ID: id } });
    if (!updatedCount) return null;
    return Case.findByPk(id);
  }

  async delete(id) {
    const deletedCount = await Case.destroy({ where: { Case_ID: id } });
    return deletedCount > 0;
  }
}

module.exports = new CaseService();
