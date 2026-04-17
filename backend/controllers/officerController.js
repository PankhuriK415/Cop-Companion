const { Op } = require('sequelize');
const Case = require('../models/Case');
const Criminal = require('../models/Criminal');
const Victim = require('../models/Victim');
const Evidence = require('../models/Evidence');
const Arrest = require('../models/Arrest');
const FIR = require('../models/FIR');
const PoliceStation = require('../models/PoliceStation');
const Officer = require('../models/Officer');

const getAllData = async (req, res, next) => {
  try {
    const cases = await Case.findAll({ order: [['Case_Date', 'DESC']] });
    const caseIds = cases.map((c) => c.Case_ID).filter(Boolean);
    const stationIds = cases.map((c) => c.Station_ID).filter(Boolean);
    const officerIds = cases.map((c) => c.Officer_ID).filter(Boolean);

    const [firs, arrests, evidences, stations, officers] = await Promise.all([
      caseIds.length > 0 ? FIR.findAll({ where: { Case_ID: caseIds } }) : [],
      caseIds.length > 0 ? Arrest.findAll({ where: { Case_ID: caseIds } }) : [],
      caseIds.length > 0 ? Evidence.findAll({ where: { Case_ID: caseIds } }) : [],
      stationIds.length > 0 ? PoliceStation.findAll({ where: { Station_ID: stationIds } }) : [],
      officerIds.length > 0 ? Officer.findAll({ where: { Officer_ID: officerIds } }) : [],
    ]);

    const stationMap = stations.reduce((acc, item) => {
      acc[item.Station_ID] = item;
      return acc;
    }, {});
    const officerMap = officers.reduce((acc, item) => {
      acc[item.Officer_ID] = item;
      return acc;
    }, {});

    const data = cases.map((c) => ({
      Case_ID: c.Case_ID,
      Case_Date: c.Case_Date,
      Case_Status: c.Case_Status,
      Case_Description: c.Description,
      Station_Name: stationMap[c.Station_ID]?.Station_Name,
      Station_Location: stationMap[c.Station_ID]?.Location,
      Officer_Name: officerMap[c.Officer_ID]?.Officer_Name,
      Officer_Rank: officerMap[c.Officer_ID]?.Officer_Rank,
      firs: firs.filter((f) => f.Case_ID === c.Case_ID).map((f) => ({
        FIR_ID: f.FIR_No,
        FIR_Date: f.FIR_Date,
      })),
      arrests: arrests.filter((a) => a.Case_ID === c.Case_ID).map((a) => ({
        Arrest_ID: a.Arrest_ID,
        Arrest_Date: a.Arrest_Date,
        Criminal_ID: a.Criminal_ID,
      })),
      evidence: evidences.filter((e) => e.Case_ID === c.Case_ID).map((e) => ({
        Evidence_ID: e.Evidence_ID,
        Evidence_Type: e.Evidence_Type,
        Evidence_Description: e.Description,
      })),
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

const getCases = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || null;
    const search = req.query.search || null;

    const filter = {};
    if (status) filter.Case_Status = status;
    if (search) filter.Description = { [Op.like]: `%${search}%` };

    const [total, rows] = await Promise.all([
      Case.count({ where: filter }),
      Case.findAll({ where: filter, order: [['Case_Date', 'DESC']], offset, limit }),
    ]);

    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getCaseById = async (req, res, next) => {
  try {
    const row = await Case.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Case not found.' });

    const station = row.Station_ID ? await PoliceStation.findByPk(row.Station_ID) : null;
    const officer = row.Officer_ID ? await Officer.findByPk(row.Officer_ID) : null;

    res.status(200).json({
      success: true,
      data: {
        ...row.get(),
        Station_ID: station,
        Officer_ID: officer,
      },
    });
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
    res.status(201).json({ success: true, message: 'Case created.', Case_ID: newCase.Case_ID });
  } catch (err) {
    next(err);
  }
};

const updateCase = async (req, res, next) => {
  const { Case_Date, Case_Status, Description, Station_ID, Officer_ID } = req.body;
  try {
    const [updatedCount] = await Case.update(
      { Case_Date, Case_Status, Description, Station_ID, Officer_ID },
      { where: { Case_ID: req.params.id } }
    );
    if (!updatedCount) return res.status(404).json({ success: false, message: 'Case not found.' });
    const updated = await Case.findByPk(req.params.id);
    res.status(200).json({ success: true, message: 'Case updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteCase = async (req, res, next) => {
  try {
    const deletedCount = await Case.destroy({ where: { Case_ID: req.params.id } });
    if (!deletedCount) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, message: 'Case deleted.' });
  } catch (err) {
    next(err);
  }
};

const getCriminals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || null;

    const filter = {};
    if (search) {
      filter[Op.or] = [
        { Criminal_Name: { [Op.like]: `%${search}%` } },
        { Address: { [Op.like]: `%${search}%` } },
      ];
    }

    const [total, rows] = await Promise.all([
      Criminal.count({ where: filter }),
      Criminal.findAll({ where: filter, order: [['Criminal_ID', 'DESC']], offset, limit }),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getCriminalById = async (req, res, next) => {
  try {
    const row = await Criminal.findByPk(req.params.id);
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
    res.status(201).json({ success: true, message: 'Criminal created.', Criminal_ID: doc.Criminal_ID });
  } catch (err) {
    next(err);
  }
};

const updateCriminal = async (req, res, next) => {
  const { Criminal_Name, Gender, DOB, Address } = req.body;
  try {
    const [updatedCount] = await Criminal.update(
      { Criminal_Name, Gender, DOB, Address },
      { where: { Criminal_ID: req.params.id } }
    );
    if (!updatedCount) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    const updated = await Criminal.findByPk(req.params.id);
    res.status(200).json({ success: true, message: 'Criminal updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteCriminal = async (req, res, next) => {
  try {
    const deletedCount = await Criminal.destroy({ where: { Criminal_ID: req.params.id } });
    if (!deletedCount) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, message: 'Criminal deleted.' });
  } catch (err) {
    next(err);
  }
};

const getVictims = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      Victim.count({}),
      Victim.findAll({ order: [['Victim_ID', 'DESC']], offset, limit }),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getVictimById = async (req, res, next) => {
  try {
    const row = await Victim.findByPk(req.params.id);
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
    res.status(201).json({ success: true, message: 'Victim created.', Victim_ID: doc.Victim_ID });
  } catch (err) {
    next(err);
  }
};

const updateVictim = async (req, res, next) => {
  const { Victim_Name, Gender, Phone, Address } = req.body;
  try {
    const [updatedCount] = await Victim.update(
      { Victim_Name, Gender, Phone, Address },
      { where: { Victim_ID: req.params.id } }
    );
    if (!updatedCount) return res.status(404).json({ success: false, message: 'Victim not found.' });
    const updated = await Victim.findByPk(req.params.id);
    res.status(200).json({ success: true, message: 'Victim updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteVictim = async (req, res, next) => {
  try {
    const deletedCount = await Victim.destroy({ where: { Victim_ID: req.params.id } });
    if (!deletedCount) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, message: 'Victim deleted.' });
  } catch (err) {
    next(err);
  }
};

const getEvidence = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const caseId = req.query.case_id || null;

    const filter = {};
    if (caseId) filter.Case_ID = caseId;

    const [total, rows] = await Promise.all([
      Evidence.count({ where: filter }),
      Evidence.findAll({ where: filter, order: [['Evidence_ID', 'DESC']], offset, limit }),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getEvidenceById = async (req, res, next) => {
  try {
    const row = await Evidence.findByPk(req.params.id);
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
    res.status(201).json({ success: true, message: 'Evidence created.', Evidence_ID: doc.Evidence_ID });
  } catch (err) {
    next(err);
  }
};

const updateEvidence = async (req, res, next) => {
  const { Evidence_Type, Description, Case_ID } = req.body;
  try {
    const [updatedCount] = await Evidence.update(
      { Evidence_Type, Description, Case_ID },
      { where: { Evidence_ID: req.params.id } }
    );
    if (!updatedCount) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    const updated = await Evidence.findByPk(req.params.id);
    res.status(200).json({ success: true, message: 'Evidence updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteEvidence = async (req, res, next) => {
  try {
    const deletedCount = await Evidence.destroy({ where: { Evidence_ID: req.params.id } });
    if (!deletedCount) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, message: 'Evidence deleted.' });
  } catch (err) {
    next(err);
  }
};

const getArrests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      Arrest.count({}),
      Arrest.findAll({ order: [['Arrest_Date', 'DESC']], offset, limit }),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getArrestById = async (req, res, next) => {
  try {
    const row = await Arrest.findByPk(req.params.id);
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
    res.status(201).json({ success: true, message: 'Arrest record created.', Arrest_ID: doc.Arrest_ID });
  } catch (err) {
    next(err);
  }
};

const updateArrest = async (req, res, next) => {
  const { Arrest_Date, Criminal_ID, Case_ID, Charges } = req.body;
  try {
    const [updatedCount] = await Arrest.update(
      { Arrest_Date, Criminal_ID, Case_ID, Charges },
      { where: { Arrest_ID: req.params.id } }
    );
    if (!updatedCount) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    const updated = await Arrest.findByPk(req.params.id);
    res.status(200).json({ success: true, message: 'Arrest record updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteArrest = async (req, res, next) => {
  try {
    const deletedCount = await Arrest.destroy({ where: { Arrest_ID: req.params.id } });
    if (!deletedCount) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, message: 'Arrest record deleted.' });
  } catch (err) {
    next(err);
  }
};

const getFIRs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      FIR.count({}),
      FIR.findAll({ order: [['FIR_Date', 'DESC']], offset, limit }),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getFIRById = async (req, res, next) => {
  try {
    const row = await FIR.findByPk(req.params.id);
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
    res.status(201).json({ success: true, message: 'FIR created.', FIR_ID: doc.FIR_No });
  } catch (err) {
    next(err);
  }
};

const updateFIR = (req, res) => {
  return res.status(403).json({ success: false, message: 'FIR records cannot be updated. This action is not permitted.' });
};

const deleteFIR = async (req, res, next) => {
  try {
    const deletedCount = await FIR.destroy({ where: { FIR_No: req.params.id } });
    if (!deletedCount) return res.status(404).json({ success: false, message: 'FIR not found.' });
    res.status(200).json({ success: true, message: 'FIR deleted.' });
  } catch (err) {
    next(err);
  }
};

const getStations = async (req, res, next) => {
  try {
    const rows = await PoliceStation.findAll({ order: [['Station_Name', 'ASC']] });
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

const getStationById = async (req, res, next) => {
  try {
    const row = await PoliceStation.findByPk(req.params.id);
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
    res.status(201).json({ success: true, message: 'Station created.', Station_ID: doc.Station_ID });
  } catch (err) {
    next(err);
  }
};

const updateStation = async (req, res, next) => {
  const { Station_Name, Location, Contact_No } = req.body;
  try {
    const [updatedCount] = await PoliceStation.update(
      { Station_Name, Location, Contact_No },
      { where: { Station_ID: req.params.id } }
    );
    if (!updatedCount) return res.status(404).json({ success: false, message: 'Station not found.' });
    const updated = await PoliceStation.findByPk(req.params.id);
    res.status(200).json({ success: true, message: 'Station updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteStation = async (req, res, next) => {
  try {
    const deletedCount = await PoliceStation.destroy({ where: { Station_ID: req.params.id } });
    if (!deletedCount) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, message: 'Station deleted.' });
  } catch (err) {
    next(err);
  }
};

const getOfficers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      Officer.count({}),
      Officer.findAll({ order: [['Officer_ID', 'DESC']], offset, limit }),
    ]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getOfficerById = async (req, res, next) => {
  try {
    const row = await Officer.findByPk(req.params.id);
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
    res.status(201).json({ success: true, message: 'Officer created.', Officer_ID: doc.Officer_ID });
  } catch (err) {
    next(err);
  }
};

const updateOfficer = async (req, res, next) => {
  const { Officer_Name, Officer_Rank, Phone, Station_ID } = req.body;
  try {
    const [updatedCount] = await Officer.update(
      { Officer_Name, Officer_Rank, Phone, Station_ID },
      { where: { Officer_ID: req.params.id } }
    );
    if (!updatedCount) return res.status(404).json({ success: false, message: 'Officer not found.' });
    const updated = await Officer.findByPk(req.params.id);
    res.status(200).json({ success: true, message: 'Officer updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteOfficer = async (req, res, next) => {
  try {
    const deletedCount = await Officer.destroy({ where: { Officer_ID: req.params.id } });
    if (!deletedCount) return res.status(404).json({ success: false, message: 'Officer not found.' });
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
