const { Op } = require('sequelize');
const Criminal = require('./criminal.model');
const Arrest = require('../arrest/arrest.model');
const Case = require('../case/case.model');

class CriminalService {
  async list({ page = 1, limit = 10, search }) {
    const offset = (page - 1) * limit;
    const filter = {};
    if (search) {
      filter[Op.or] = [
        { Criminal_Name: { [Op.like]: `%${search}%` } },
        { Address: { [Op.like]: `%${search}%` } },
      ];
    }
    const [total, data] = await Promise.all([
      Criminal.count({ where: filter }),
      Criminal.findAll({ where: filter, order: [['Criminal_ID', 'DESC']], offset, limit }),
    ]);
    return { total, page, limit, data };
  }

  async findById(id) {
    return Criminal.findByPk(id);
  }

  async create(data) {
    return Criminal.create(data);
  }

  async update(id, data) {
    const [updatedCount] = await Criminal.update(data, { where: { Criminal_ID: id } });
    if (!updatedCount) return null;
    return Criminal.findByPk(id);
  }

  async delete(id) {
    const deletedCount = await Criminal.destroy({ where: { Criminal_ID: id } });
    return deletedCount > 0;
  }

  async getCriminalStatus(criminalId) {
    const criminal = await Criminal.findByPk(criminalId);
    if (!criminal) return null;

    const arrests = await Arrest.findAll({ where: { Criminal_ID: criminalId } });
    const caseIds = arrests.map((a) => a.Case_ID).filter(Boolean);
    const cases = caseIds.length > 0 ? await Case.findAll({ where: { Case_ID: caseIds } }) : [];
    const caseMap = cases.reduce((acc, c) => {
      acc[c.Case_ID] = c;
      return acc;
    }, {});

    return {
      Criminal_ID: criminal.Criminal_ID,
      Criminal_Name: criminal.Criminal_Name,
      Gender: criminal.Gender,
      DOB: criminal.DOB,
      Address: criminal.Address,
      cases: arrests.map((a) => {
        const relatedCase = caseMap[a.Case_ID];
        return {
          Arrest_ID: a.Arrest_ID,
          Arrest_Date: a.Arrest_Date,
          Case_ID: a.Case_ID,
          Case_Status: relatedCase?.Case_Status,
          Case_Date: relatedCase?.Case_Date,
          Case_Description: relatedCase?.Description,
        };
      }),
    };
  }
}

module.exports = new CriminalService();
