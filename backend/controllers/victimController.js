const db = require('../config/db');

const getVictimData = async (req, res, next) => {
  const victimId = req.user.user_id;

  try {
    const [rows] = await db.query(
      `SELECT
        v.Victim_ID, v.Victim_Name, v.Gender, v.Phone, v.Address,
        f.FIR_No, f.FIR_Date,
        c.Case_ID, c.Case_Date, c.Case_Status, c.Description AS Case_Description,
        ps.Station_Name,
        e.Evidence_ID, e.Evidence_Type, e.Description AS Evidence_Description
      FROM victim v
      LEFT JOIN fir f ON f.Victim_ID = v.Victim_ID
      LEFT JOIN cases c ON f.Case_ID = c.Case_ID
      LEFT JOIN police_station ps ON c.Station_ID = ps.Station_ID
      LEFT JOIN evidence e ON e.Case_ID = c.Case_ID
      WHERE v.Victim_ID = ?`,
      [victimId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No data found for this victim.' });
    }

    // Group evidence under cases
    const result = {
      victim: {
        Victim_ID: rows[0].Victim_ID,
        Victim_Name: rows[0].Victim_Name,
        Gender: rows[0].Gender,
        Phone: rows[0].Phone,
        Address: rows[0].Address,
      },
      cases: [],
    };

    const caseMap = {};
    for (const row of rows) {
      if (!row.Case_ID) continue;
      if (!caseMap[row.Case_ID]) {
        caseMap[row.Case_ID] = {
          FIR_No: row.FIR_No,
          FIR_Date: row.FIR_Date,
          Case_ID: row.Case_ID,
          Case_Date: row.Case_Date,
          Case_Status: row.Case_Status,
          Case_Description: row.Case_Description,
          Station_Name: row.Station_Name,
          evidence: [],
        };
      }
      if (row.Evidence_ID) {
        caseMap[row.Case_ID].evidence.push({
          Evidence_ID: row.Evidence_ID,
          Evidence_Type: row.Evidence_Type,
          Evidence_Description: row.Evidence_Description,
        });
      }
    }

    result.cases = Object.values(caseMap);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVictimData };
