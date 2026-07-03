const officerService = require('./officer.service');

const getOfficers = async (req, res, next) => {
  try {
    const result = await officerService.list({ page: parseInt(req.query.page) || 1, limit: parseInt(req.query.limit) || 10 });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
const getOfficerById = async (req, res, next) => {
  try {
    const data = await officerService.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Officer not found.' });
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};
const createOfficer = async (req, res, next) => {
  try {
    const doc = await officerService.create(req.body);
    res.status(201).json({ success: true, message: 'Officer created.', Officer_ID: doc.Officer_ID });
  } catch (err) { next(err); }
};
const updateOfficer = async (req, res, next) => {
  try {
    const updated = await officerService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Officer not found.' });
    res.status(200).json({ success: true, message: 'Officer updated.', data: updated });
  } catch (err) { next(err); }
};
const deleteOfficer = async (req, res, next) => {
  try {
    const deleted = await officerService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Officer not found.' });
    res.status(200).json({ success: true, message: 'Officer deleted.' });
  } catch (err) { next(err); }
};
module.exports = { getOfficers, getOfficerById, createOfficer, updateOfficer, deleteOfficer };
