const arrestService = require('./arrest.service');
const getArrests = async (req, res, next) => {
  try {
    const result = await arrestService.list({ page: parseInt(req.query.page) || 1, limit: parseInt(req.query.limit) || 10 });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
const getArrestById = async (req, res, next) => {
  try {
    const data = await arrestService.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};
const createArrest = async (req, res, next) => {
  try {
    const doc = await arrestService.create(req.body);
    res.status(201).json({ success: true, message: 'Arrest record created.', Arrest_ID: doc.Arrest_ID });
  } catch (err) { next(err); }
};
const updateArrest = async (req, res, next) => {
  try {
    const updated = await arrestService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, message: 'Arrest record updated.', data: updated });
  } catch (err) { next(err); }
};
const deleteArrest = async (req, res, next) => {
  try {
    const deleted = await arrestService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, message: 'Arrest record deleted.' });
  } catch (err) { next(err); }
};
module.exports = { getArrests, getArrestById, createArrest, updateArrest, deleteArrest };
