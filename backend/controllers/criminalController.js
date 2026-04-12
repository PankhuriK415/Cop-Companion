const Criminal = require('../models/Criminal');
const Arrest = require('../models/Arrest');
const Case = require('../models/Case');

const getCriminalStatus = async (req, res, next) => {
  const criminalId = req.user.user_id;

  try {
    const criminal = await Criminal.findByPk(criminalId);
    if (!criminal) {
      return res.status(404).json({ success: false, message: 'No data found for this criminal.' });
    }

    const arrests = await Arrest.findAll({ where: { Criminal_ID: criminalId } });
    const caseIds = arrests.map((a) => a.Case_ID).filter(Boolean);
    const cases = caseIds.length > 0 ? await Case.findAll({ where: { Case_ID: caseIds } }) : [];
    const caseMap = cases.reduce((acc, c) => {
      acc[c.Case_ID] = c;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
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
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCriminalStatus };
