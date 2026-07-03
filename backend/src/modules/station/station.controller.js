const stationService = require('./station.service');
const getStations = async (req, res, next) => {
  try {
    const result = await stationService.list();
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
const getStationById = async (req, res, next) => {
  try {
    const data = await stationService.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};
const createStation = async (req, res, next) => {
  try {
    const doc = await stationService.create(req.body);
    res.status(201).json({ success: true, message: 'Station created.', Station_ID: doc.Station_ID });
  } catch (err) { next(err); }
};
const updateStation = async (req, res, next) => {
  try {
    const updated = await stationService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, message: 'Station updated.', data: updated });
  } catch (err) { next(err); }
};
const deleteStation = async (req, res, next) => {
  try {
    const deleted = await stationService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, message: 'Station deleted.' });
  } catch (err) { next(err); }
};
module.exports = { getStations, getStationById, createStation, updateStation, deleteStation };
