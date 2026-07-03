const firService = require('./fir.service');
const getFIRs = async (req, res, next) => {
  try {
    const result = await firService.list({ page: parseInt(req.query.page) || 1, limit: parseInt(req.query.limit) || 10 });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
const getFIRById = async (req, res, next) => {
  try {
    const data = await firService.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'FIR not found.' });
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};
const createFIR = async (req, res, next) => {
  try {
    const doc = await firService.create(req.body);
    res.status(201).json({ success: true, message: 'FIR created.', FIR_ID: doc.FIR_No });
  } catch (err) { next(err); }
};
const updateFIR = (req, res) => {
  return res.status(403).json({ success: false, message: 'FIR records cannot be updated. This action is not permitted.' });
};
const deleteFIR = async (req, res, next) => {
  try {
    const deleted = await firService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'FIR not found.' });
    res.status(200).json({ success: true, message: 'FIR deleted.' });
  } catch (err) { next(err); }
};
module.exports = { getFIRs, getFIRById, createFIR, updateFIR, deleteFIR };
