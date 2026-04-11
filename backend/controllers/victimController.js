const Victim   = require('../models/Victim');
const FIR      = require('../models/FIR');
const Case     = require('../models/Case');
const Evidence = require('../models/Evidence');

const getVictimData = async (req, res, next) => {
  const victimId = req.user.user_id;

  try {
    const victim = await Victim.findById(victimId);
    if (!victim) return res.status(404).json({ success: false, message: 'No data found for this victim.' });

    const firs = await FIR.find({ Victim_ID: victimId }).populate({
      path: 'Case_ID',
      populate: { path: 'Station_ID', select: 'Station_Name' },
    });

    const cases = await Promise.all(
      firs.map(async (fir) => {
        const c = fir.Case_ID;
        if (!c) return null;
        const evidence = await Evidence.find({ Case_ID: c._id });
        return {
          FIR_ID: fir._id,
          FIR_Date: fir.FIR_Date,
          Case_ID: c._id,
          Case_Date: c.Case_Date,
          Case_Status: c.Case_Status,
          Case_Description: c.Description,
          Station_Name: c.Station_ID?.Station_Name,
          evidence: evidence.map(e => ({
            Evidence_ID: e._id,
            Evidence_Type: e.Evidence_Type,
            Evidence_Description: e.Description,
          })),
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        victim: {
          Victim_ID: victim._id,
          Victim_Name: victim.Victim_Name,
          Gender: victim.Gender,
          Phone: victim.Phone,
          Address: victim.Address,
        },
        cases: cases.filter(Boolean),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVictimData };
