const Criminal = require('../models/Criminal');
const Arrest   = require('../models/Arrest');

const getCriminalStatus = async (req, res, next) => {
  const criminalId = req.user.user_id;

  try {
    const criminal = await Criminal.findById(criminalId);
    if (!criminal) return res.status(404).json({ success: false, message: 'No data found for this criminal.' });

    const arrests = await Arrest.find({ Criminal_ID: criminalId })
      .populate('Case_ID', 'Case_Status Case_Date Description');

    res.status(200).json({
      success: true,
      data: {
        Criminal_ID: criminal._id,
        Criminal_Name: criminal.Criminal_Name,
        cases: arrests.map(a => ({
          Arrest_ID: a._id,
          Arrest_Date: a.Arrest_Date,
          Case_ID: a.Case_ID?._id,
          Case_Status: a.Case_ID?.Case_Status,
          Case_Date: a.Case_ID?.Case_Date,
          Case_Description: a.Case_ID?.Description,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCriminalStatus };
