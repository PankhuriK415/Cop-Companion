const Victim = require('./victim.model');
const FIR = require('../fir/fir.model');
const Case = require('../case/case.model');
const Evidence = require('../evidence/evidence.model');

class VictimService {
  async list({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const [total, data] = await Promise.all([
      Victim.count({}),
      Victim.findAll({ order: [['Victim_ID', 'DESC']], offset, limit }),
    ]);
    return { total, page, limit, data };
  }
  async findById(id) { return Victim.findByPk(id); }
  async create(data) { return Victim.create(data); }
  async update(id, data) {
    const [c] = await Victim.update(data, { where: { Victim_ID: id } });
    if (!c) return null;
    return Victim.findByPk(id);
  }
  async delete(id) {
    return (await Victim.destroy({ where: { Victim_ID: id } })) > 0;
  }
  async getVictimData(victimId) {
    const victim = await Victim.findByPk(victimId);
    if (!victim) return null;

    const firs = await FIR.findAll({ where: { Victim_ID: victimId } });
    const caseIds = firs.map((fir) => fir.Case_ID).filter(Boolean);
    const cases = caseIds.length > 0 ? await Case.findAll({ where: { Case_ID: caseIds } }) : [];
    const evidence = caseIds.length > 0 ? await Evidence.findAll({ where: { Case_ID: caseIds } }) : [];

    const caseMap = cases.reduce((acc, c) => {
      acc[c.Case_ID] = c;
      return acc;
    }, {});

    const evidenceByCaseId = evidence.reduce((acc, item) => {
      if (!acc[item.Case_ID]) acc[item.Case_ID] = [];
      acc[item.Case_ID].push(item);
      return acc;
    }, {});

    const casesData = firs.map((fir) => {
      const c = caseMap[fir.Case_ID];
      if (!c) return null;
      return {
        FIR_ID: fir.FIR_No,
        FIR_Date: fir.FIR_Date,
        Case_ID: c.Case_ID,
        Case_Date: c.Case_Date,
        Case_Status: c.Case_Status,
        Case_Description: c.Description,
        evidence: (evidenceByCaseId[c.Case_ID] || []).map((e) => ({
          Evidence_ID: e.Evidence_ID,
          Evidence_Type: e.Evidence_Type,
          Evidence_Description: e.Description,
        })),
      };
    }).filter(Boolean);

    return {
      victim: {
        Victim_ID: victim.Victim_ID,
        Victim_Name: victim.Victim_Name,
        Gender: victim.Gender,
        Phone: victim.Phone,
        Address: victim.Address,
      },
      cases: casesData,
    };
  }
}
module.exports = new VictimService();
