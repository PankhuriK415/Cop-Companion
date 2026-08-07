const dashboardService = require('./dashboard.service');

const getAllData = async (req, res, next) => {
  try {
    const data = await dashboardService.getAllData();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllData };
