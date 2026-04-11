const db = require('../config/db');

const getCriminalStatus = async (req, res, next) => {
  const criminalId = req.user.user_id;

  try {
    const [rows] = await db.query(
      `SELECT
        cr.Criminal_ID, cr.Criminal_Name,
        a.Arrest_ID, a.Arrest_Date,
        c.Case_ID, c.Case_Status, c.Case_Date, c.Description AS Case_Description
      FROM criminal cr
      LEFT JOIN arrest a ON a.Criminal_ID = cr.Criminal_ID
      LEFT JOIN cases c ON a.Case_ID = c.Case_ID
      WHERE cr.Criminal_ID = ?`,
      [criminalId]
    );

    if (rows.length === 0 || !rows[0].Criminal_ID) {
      return res.status(404).json({ success: false, message: 'No data found for this criminal.' });
    }

    const result = {
      Criminal_ID: rows[0].Criminal_ID,
      Criminal_Name: rows[0].Criminal_Name,
      cases: rows
        .filter(r => r.Case_ID)
        .map(r => ({
          Arrest_ID: r.Arrest_ID,
          Arrest_Date: r.Arrest_Date,
          Case_ID: r.Case_ID,
          Case_Status: r.Case_Status,
          Case_Date: r.Case_Date,
          Case_Description: r.Case_Description,
        })),
    };

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCriminalStatus };
