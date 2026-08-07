const criminalService = require('./criminal.service');

const getCriminals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await criminalService.list({ page, limit, search: req.query.search });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getCriminalById = async (req, res, next) => {
  try {
    const data = await criminalService.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const createCriminal = async (req, res, next) => {
  try {
    const doc = await criminalService.create(req.body);
    res.status(201).json({ success: true, message: 'Criminal created.', Criminal_ID: doc.Criminal_ID });
  } catch (err) { next(err); }
};

const updateCriminal = async (req, res, next) => {
  try {
    const updated = await criminalService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, message: 'Criminal updated.', data: updated });
  } catch (err) { next(err); }
};

const deleteCriminal = async (req, res, next) => {
  try {
    const deleted = await criminalService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, message: 'Criminal deleted.' });
  } catch (err) { next(err); }
};

const getCriminalStatus = async (req, res, next) => {
  const criminalId = req.user.user_id;
  try {
    const data = await criminalService.getCriminalStatus(criminalId);
    if (!data) {
      return res.status(404).json({ success: false, message: 'No data found for this criminal.' });
    }
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getCriminals, getCriminalById, createCriminal, updateCriminal, deleteCriminal, getCriminalStatus };
