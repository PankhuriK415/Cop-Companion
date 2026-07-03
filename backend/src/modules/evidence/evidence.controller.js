const evidenceService = require('./evidence.service');
const getEvidence = async (req, res, next) => {
  try {
    const result = await evidenceService.list({ page: parseInt(req.query.page) || 1, limit: parseInt(req.query.limit) || 10, case_id: req.query.case_id });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
const getEvidenceById = async (req, res, next) => {
  try {
    const data = await evidenceService.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};
const createEvidence = async (req, res, next) => {
  try {
    const doc = await evidenceService.create(req.body);
    res.status(201).json({ success: true, message: 'Evidence created.', Evidence_ID: doc.Evidence_ID });
  } catch (err) { next(err); }
};
const updateEvidence = async (req, res, next) => {
  try {
    const updated = await evidenceService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, message: 'Evidence updated.', data: updated });
  } catch (err) { next(err); }
};
const deleteEvidence = async (req, res, next) => {
  try {
    const deleted = await evidenceService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, message: 'Evidence deleted.' });
  } catch (err) { next(err); }
};
module.exports = { getEvidence, getEvidenceById, createEvidence, updateEvidence, deleteEvidence };
