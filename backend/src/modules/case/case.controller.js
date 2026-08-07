const caseService = require('./case.service');

const getCases = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await caseService.list({ page, limit, status: req.query.status, search: req.query.search });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getCaseById = async (req, res, next) => {
  try {
    const data = await caseService.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const createCase = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.user?.role !== 'chief') {
      delete payload.Officer_ID;
    }
    const newCase = await caseService.create(payload);
    res.status(201).json({ success: true, message: 'Case created.', Case_ID: newCase.Case_ID });
  } catch (err) {
    next(err);
  }
};

const updateCase = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.user?.role !== 'chief') {
      delete payload.Officer_ID;
    }
    const updated = await caseService.update(req.params.id, payload);
    if (!updated) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, message: 'Case updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteCase = async (req, res, next) => {
  try {
    const deleted = await caseService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, message: 'Case deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCases, getCaseById, createCase, updateCase, deleteCase };
