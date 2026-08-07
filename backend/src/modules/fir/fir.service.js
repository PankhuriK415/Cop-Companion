const FIR = require('./fir.model');
const Case = require('../case/case.model');
const Victim = require('../victim/victim.model');
const { sequelize } = require('../../shared/database/connection');

class FIRService {
  async list({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const [total, data] = await Promise.all([
      FIR.count({}),
      FIR.findAll({
        order: [['FIR_Date', 'DESC']],
        offset,
        limit,
        include: [
          { model: Case, attributes: ['Case_ID', 'Case_Status', 'Description', 'Case_Date'] },
          { model: Victim, attributes: ['Victim_ID', 'Victim_Name'] },
        ],
      }),
    ]);
    return { total, page, limit, data };
  }

  async findById(id) {
    return FIR.findByPk(id, {
      include: [
        { model: Case, attributes: ['Case_ID', 'Case_Status', 'Description', 'Case_Date'] },
        { model: Victim, attributes: ['Victim_ID', 'Victim_Name'] },
      ],
    });
  }

  /**
   * Create an FIR. When `newCase` is provided, create the case then link it
   * in a single transaction.
   */
  async create(data) {
    const { newCase, ...firFields } = data;

    if (!newCase) {
      return FIR.create(firFields);
    }

    return sequelize.transaction(async (t) => {
      const createdCase = await Case.create(
        {
          Case_Date: newCase.Case_Date,
          Case_Status: newCase.Case_Status || 'Open',
          Description: newCase.Description,
          Station_ID: newCase.Station_ID ?? null,
          Officer_ID: newCase.Officer_ID ?? null,
        },
        { transaction: t }
      );

      const fir = await FIR.create(
        {
          FIR_Date: firFields.FIR_Date,
          Victim_ID: firFields.Victim_ID ?? null,
          Case_ID: createdCase.Case_ID,
        },
        { transaction: t }
      );

      return fir;
    });
  }

  async delete(id) {
    return (await FIR.destroy({ where: { FIR_No: id } })) > 0;
  }
}

module.exports = new FIRService();
