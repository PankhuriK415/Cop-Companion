const victimService = require('./victim.service');

const getVictims = async (req, res, next) => {
  try {
    const result = await victimService.list({ page: parseInt(req.query.page) || 1, limit: parseInt(req.query.limit) || 10 });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
const getVictimById = async (req, res, next) => {
  try {
    const data = await victimService.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};
const createVictim = async (req, res, next) => {
  try {
    const doc = await victimService.create(req.body);
    res.status(201).json({ success: true, message: 'Victim created.', Victim_ID: doc.Victim_ID });
  } catch (err) { next(err); }
};
const updateVictim = async (req, res, next) => {
  try {
    const updated = await victimService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, message: 'Victim updated.', data: updated });
  } catch (err) { next(err); }
};
const deleteVictim = async (req, res, next) => {
  try {
    const deleted = await victimService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, message: 'Victim deleted.' });
  } catch (err) { next(err); }
};

const getVictimData = async (req, res, next) => {
  const victimId = req.user.user_id;
  try {
    const data = await victimService.getVictimData(victimId);
    if (!data) return res.status(404).json({ success: false, message: 'No data found for this victim.' });
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getVictims, getVictimById, createVictim, updateVictim, deleteVictim, getVictimData };
