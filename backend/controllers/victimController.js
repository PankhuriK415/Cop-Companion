const Victim = require('../models/Victim');
const FIR = require('../models/FIR');
const Case = require('../models/Case');
const Evidence = require('../models/Evidence');

const getVictimData = async (req, res, next) => {
  const victimId = req.user.user_id;

  try {
    const victim = await Victim.findByPk(victimId);
    if (!victim) return res.status(404).json({ success: false, message: 'No data found for this victim.' });

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

    res.status(200).json({
      success: true,
      data: {
        victim: {
          Victim_ID: victim.Victim_ID,
          Victim_Name: victim.Victim_Name,
          Gender: victim.Gender,
          Phone: victim.Phone,
          Address: victim.Address,
        },
        cases: casesData,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVictimData };
