const Case       = require('../models/Case');
const Criminal   = require('../models/Criminal');
const Victim     = require('../models/Victim');
const Evidence   = require('../models/Evidence');
const Arrest     = require('../models/Arrest');
const FIR        = require('../models/FIR');
const PoliceStation = require('../models/PoliceStation');
const Officer    = require('../models/Officer');

// ─── AGGREGATE ───────────────────────────────────────────────────────────────

const getAllData = async (req, res, next) => {
  try {
    const cases = await Case.find()
      .populate('Station_ID', 'Station_Name Location')
      .populate('Officer_ID', 'Officer_Name Officer_Rank')
      .sort({ Case_Date: -1 });

    const caseIds = cases.map(c => c._id);

    const [firs, arrests, evidences] = await Promise.all([
      FIR.find({ Case_ID: { $in: caseIds } }).populate('Victim_ID', 'Victim_Name Phone'),
      Arrest.find({ Case_ID: { $in: caseIds } }).populate('Criminal_ID', 'Criminal_Name Gender'),
      Evidence.find({ Case_ID: { $in: caseIds } }),
    ]);

    const data = cases.map(c => ({
      Case_ID: c._id,
      Case_Date: c.Case_Date,
      Case_Status: c.Case_Status,
      Case_Description: c.Description,
      Station_Name: c.Station_ID?.Station_Name,
      Station_Location: c.Station_ID?.Location,
      Officer_Name: c.Officer_ID?.Officer_Name,
      Officer_Rank: c.Officer_ID?.Officer_Rank,
      firs: firs.filter(f => f.Case_ID.toString() === c._id.toString()).map(f => ({
        FIR_ID: f._id,
        FIR_Date: f.FIR_Date,
        Victim_Name: f.Victim_ID?.Victim_Name,
        Victim_Phone: f.Victim_ID?.Phone,
      })),
      arrests: arrests.filter(a => a.Case_ID.toString() === c._id.toString()).map(a => ({
        Arrest_ID: a._id,
        Arrest_Date: a.Arrest_Date,
        Criminal_Name: a.Criminal_ID?.Criminal_Name,
        Criminal_Gender: a.Criminal_ID?.Gender,
      })),
      evidence: evidences.filter(e => e.Case_ID.toString() === c._id.toString()).map(e => ({
        Evidence_ID: e._id,
        Evidence_Type: e.Evidence_Type,
        Evidence_Description: e.Description,
      })),
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// ─── CASES ────────────────────────────────────────────────────────────────────

const getCases = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const skip   = (page - 1) * limit;
    const status = req.query.status || null;
    const search = req.query.search || null;

    const filter = {};
    if (status) filter.Case_Status = status;
    if (search) filter.Description = { $regex: search, $options: 'i' };

    const [total, rows] = await Promise.all([
      Case.countDocuments(filter),
      Case.find(filter)
        .populate('Station_ID', 'Station_Name')
        .populate('Officer_ID', 'Officer_Name')
        .sort({ Case_Date: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getCaseById = async (req, res, next) => {
  try {
    const row = await Case.findById(req.params.id)
      .populate('Station_ID', 'Station_Name Location')
      .populate('Officer_ID', 'Officer_Name Officer_Rank');
    if (!row) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
};

const createCase = async (req, res, next) => {
  const { Case_Date, Case_Status, Description, Station_ID, Officer_ID } = req.body;
  if (!Case_Date || !Case_Status || !Station_ID || !Officer_ID) {
    return res.status(400).json({ success: false, message: 'Case_Date, Case_Status, Station_ID, and Officer_ID are required.' });
  }
  try {
    const newCase = await Case.create({ Case_Date, Case_Status, Description, Station_ID, Officer_ID });
    res.status(201).json({ success: true, message: 'Case created.', Case_ID: newCase._id });
  } catch (err) {
    next(err);
  }
};

const updateCase = async (req, res, next) => {
  const { Case_Date, Case_Status, Description, Station_ID, Officer_ID } = req.body;
  try {
    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { Case_Date, Case_Status, Description, Station_ID, Officer_ID },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, message: 'Case updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteCase = async (req, res, next) => {
  try {
    const deleted = await Case.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, message: 'Case deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── CRIMINAL ─────────────────────────────────────────────────────────────────

const getCriminals = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;
    const search = req.query.search || null;

    const filter = {};
    if (search) filter.$or = [
      { Criminal_Name: { $regex: search, $options: 'i' } },
      { Address: { $regex: search, $options: 'i' } },
    ];

    const [total, rows] = await Promise.all([
      Criminal.countDocuments(filter),
      Criminal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getCriminalById = async (req, res, next) => {
  try {
    const row = await Criminal.findById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
};

const createCriminal = async (req, res, next) => {
  const { Criminal_Name, Gender, DOB, Address } = req.body;
  if (!Criminal_Name) return res.status(400).json({ success: false, message: 'Criminal_Name is required.' });
  try {
    const doc = await Criminal.create({ Criminal_Name, Gender, DOB, Address });
    res.status(201).json({ success: true, message: 'Criminal created.', Criminal_ID: doc._id });
  } catch (err) {
    next(err);
  }
};

const updateCriminal = async (req, res, next) => {
  const { Criminal_Name, Gender, DOB, Address } = req.body;
  try {
    const updated = await Criminal.findByIdAndUpdate(
      req.params.id, { Criminal_Name, Gender, DOB, Address }, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, message: 'Criminal updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteCriminal = async (req, res, next) => {
  try {
    const deleted = await Criminal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, message: 'Criminal deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── VICTIM ───────────────────────────────────────────────────────────────────

const getVictims = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      Victim.countDocuments(),
      Victim.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getVictimById = async (req, res, next) => {
  try {
    const row = await Victim.findById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
};

const createVictim = async (req, res, next) => {
  const { Victim_Name, Gender, Phone, Address } = req.body;
  if (!Victim_Name) return res.status(400).json({ success: false, message: 'Victim_Name is required.' });
  try {
    const doc = await Victim.create({ Victim_Name, Gender, Phone, Address });
    res.status(201).json({ success: true, message: 'Victim created.', Victim_ID: doc._id });
  } catch (err) {
    next(err);
  }
};

const updateVictim = async (req, res, next) => {
  const { Victim_Name, Gender, Phone, Address } = req.body;
  try {
    const updated = await Victim.findByIdAndUpdate(
      req.params.id, { Victim_Name, Gender, Phone, Address }, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, message: 'Victim updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteVictim = async (req, res, next) => {
  try {
    const deleted = await Victim.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, message: 'Victim deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── EVIDENCE ─────────────────────────────────────────────────────────────────

const getEvidence = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const skip   = (page - 1) * limit;
    const caseId = req.query.case_id || null;

    const filter = {};
    if (caseId) filter.Case_ID = caseId;

    const [total, rows] = await Promise.all([
      Evidence.countDocuments(filter),
      Evidence.find(filter).populate('Case_ID', 'Case_Status Description').skip(skip).limit(limit),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getEvidenceById = async (req, res, next) => {
  try {
    const row = await Evidence.findById(req.params.id).populate('Case_ID', 'Case_Status Description');
    if (!row) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
};

const createEvidence = async (req, res, next) => {
  const { Evidence_Type, Description, Case_ID } = req.body;
  if (!Evidence_Type || !Case_ID) return res.status(400).json({ success: false, message: 'Evidence_Type and Case_ID are required.' });
  try {
    const doc = await Evidence.create({ Evidence_Type, Description, Case_ID });
    res.status(201).json({ success: true, message: 'Evidence created.', Evidence_ID: doc._id });
  } catch (err) {
    next(err);
  }
};

const updateEvidence = async (req, res, next) => {
  const { Evidence_Type, Description, Case_ID } = req.body;
  try {
    const updated = await Evidence.findByIdAndUpdate(
      req.params.id, { Evidence_Type, Description, Case_ID }, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, message: 'Evidence updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteEvidence = async (req, res, next) => {
  try {
    const deleted = await Evidence.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, message: 'Evidence deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── ARREST ───────────────────────────────────────────────────────────────────

const getArrests = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      Arrest.countDocuments(),
      Arrest.find()
        .populate('Criminal_ID', 'Criminal_Name')
        .populate('Case_ID', 'Case_Status')
        .sort({ Arrest_Date: -1 })
        .skip(skip)
        .limit(limit),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getArrestById = async (req, res, next) => {
  try {
    const row = await Arrest.findById(req.params.id)
      .populate('Criminal_ID', 'Criminal_Name Gender DOB Address')
      .populate('Case_ID', 'Case_Status Case_Date Description');
    if (!row) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
};

const createArrest = async (req, res, next) => {
  const { Arrest_Date, Criminal_ID, Case_ID, Charges } = req.body;
  if (!Arrest_Date || !Criminal_ID || !Case_ID) return res.status(400).json({ success: false, message: 'Arrest_Date, Criminal_ID, and Case_ID are required.' });
  try {
    const doc = await Arrest.create({ Arrest_Date, Criminal_ID, Case_ID, Charges });
    res.status(201).json({ success: true, message: 'Arrest record created.', Arrest_ID: doc._id });
  } catch (err) {
    next(err);
  }
};

const updateArrest = async (req, res, next) => {
  const { Arrest_Date, Criminal_ID, Case_ID, Charges } = req.body;
  try {
    const updated = await Arrest.findByIdAndUpdate(
      req.params.id, { Arrest_Date, Criminal_ID, Case_ID, Charges }, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, message: 'Arrest record updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteArrest = async (req, res, next) => {
  try {
    const deleted = await Arrest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, message: 'Arrest record deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── FIR ──────────────────────────────────────────────────────────────────────

const getFIRs = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      FIR.countDocuments(),
      FIR.find()
        .populate('Victim_ID', 'Victim_Name')
        .populate('Case_ID', 'Case_Status')
        .sort({ FIR_Date: -1 })
        .skip(skip)
        .limit(limit),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getFIRById = async (req, res, next) => {
  try {
    const row = await FIR.findById(req.params.id)
      .populate('Victim_ID', 'Victim_Name Gender Phone Address')
      .populate({ path: 'Case_ID', populate: { path: 'Station_ID', select: 'Station_Name' } });
    if (!row) return res.status(404).json({ success: false, message: 'FIR not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
};

const createFIR = async (req, res, next) => {
  const { FIR_Date, Case_ID, Victim_ID } = req.body;
  if (!FIR_Date || !Case_ID || !Victim_ID) return res.status(400).json({ success: false, message: 'FIR_Date, Case_ID, and Victim_ID are required.' });
  try {
    const doc = await FIR.create({ FIR_Date, Case_ID, Victim_ID });
    res.status(201).json({ success: true, message: 'FIR created.', FIR_ID: doc._id });
  } catch (err) {
    next(err);
  }
};

const updateFIR = (req, res) => {
  return res.status(403).json({ success: false, message: 'FIR records cannot be updated. This action is not permitted.' });
};

const deleteFIR = async (req, res, next) => {
  try {
    const deleted = await FIR.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'FIR not found.' });
    res.status(200).json({ success: true, message: 'FIR deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── POLICE STATION ───────────────────────────────────────────────────────────

const getStations = async (req, res, next) => {
  try {
    const rows = await PoliceStation.find().sort({ Station_Name: 1 });
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

const getStationById = async (req, res, next) => {
  try {
    const row = await PoliceStation.findById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
};

const createStation = async (req, res, next) => {
  const { Station_Name, Location, Contact_No } = req.body;
  if (!Station_Name) return res.status(400).json({ success: false, message: 'Station_Name is required.' });
  try {
    const doc = await PoliceStation.create({ Station_Name, Location, Contact_No });
    res.status(201).json({ success: true, message: 'Station created.', Station_ID: doc._id });
  } catch (err) {
    next(err);
  }
};

const updateStation = async (req, res, next) => {
  const { Station_Name, Location, Contact_No } = req.body;
  try {
    const updated = await PoliceStation.findByIdAndUpdate(
      req.params.id, { Station_Name, Location, Contact_No }, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, message: 'Station updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteStation = async (req, res, next) => {
  try {
    const deleted = await PoliceStation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, message: 'Station deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── OFFICER ──────────────────────────────────────────────────────────────────

const getOfficers = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      Officer.countDocuments(),
      Officer.find()
        .populate('Station_ID', 'Station_Name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getOfficerById = async (req, res, next) => {
  try {
    const row = await Officer.findById(req.params.id).populate('Station_ID', 'Station_Name Location');
    if (!row) return res.status(404).json({ success: false, message: 'Officer not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
};

const createOfficer = async (req, res, next) => {
  const { Officer_Name, Officer_Rank, Phone, Station_ID } = req.body;
  if (!Officer_Name || !Station_ID) return res.status(400).json({ success: false, message: 'Officer_Name and Station_ID are required.' });
  try {
    const doc = await Officer.create({ Officer_Name, Officer_Rank, Phone, Station_ID });
    res.status(201).json({ success: true, message: 'Officer created.', Officer_ID: doc._id });
  } catch (err) {
    next(err);
  }
};

const updateOfficer = async (req, res, next) => {
  const { Officer_Name, Officer_Rank, Phone, Station_ID } = req.body;
  try {
    const updated = await Officer.findByIdAndUpdate(
      req.params.id, { Officer_Name, Officer_Rank, Phone, Station_ID }, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Officer not found.' });
    res.status(200).json({ success: true, message: 'Officer updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteOfficer = async (req, res, next) => {
  try {
    const deleted = await Officer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Officer not found.' });
    res.status(200).json({ success: true, message: 'Officer deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllData,
  getCases, getCaseById, createCase, updateCase, deleteCase,
  getCriminals, getCriminalById, createCriminal, updateCriminal, deleteCriminal,
  getVictims, getVictimById, createVictim, updateVictim, deleteVictim,
  getEvidence, getEvidenceById, createEvidence, updateEvidence, deleteEvidence,
  getArrests, getArrestById, createArrest, updateArrest, deleteArrest,
  getFIRs, getFIRById, createFIR, updateFIR, deleteFIR,
  getStations, getStationById, createStation, updateStation, deleteStation,
  getOfficers, getOfficerById, createOfficer, updateOfficer, deleteOfficer,
};
