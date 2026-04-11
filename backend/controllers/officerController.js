const db = require('../config/db');

// ─── AGGREGATE ───────────────────────────────────────────────────────────────

const getAllData = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.Case_ID, c.Case_Date, c.Case_Status, c.Description AS Case_Description,
        ps.Station_Name, ps.Location AS Station_Location,
        o.Officer_Name, o.Officer_Rank,
        f.FIR_No, f.FIR_Date,
        v.Victim_Name, v.Phone AS Victim_Phone,
        cr.Criminal_Name, cr.Gender AS Criminal_Gender,
        a.Arrest_Date,
        e.Evidence_Type, e.Description AS Evidence_Description
      FROM cases c
      LEFT JOIN police_station ps ON c.Station_ID = ps.Station_ID
      LEFT JOIN officer o ON c.Officer_ID = o.Officer_ID
      LEFT JOIN fir f ON f.Case_ID = c.Case_ID
      LEFT JOIN victim v ON f.Victim_ID = v.Victim_ID
      LEFT JOIN arrest a ON a.Case_ID = c.Case_ID
      LEFT JOIN criminal cr ON a.Criminal_ID = cr.Criminal_ID
      LEFT JOIN evidence e ON e.Case_ID = c.Case_ID
      ORDER BY c.Case_Date DESC
    `);
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// ─── CASES ────────────────────────────────────────────────────────────────────

const getCases = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || null;
    const search = req.query.search || null;

    let query = 'SELECT c.*, ps.Station_Name, o.Officer_Name FROM cases c LEFT JOIN police_station ps ON c.Station_ID = ps.Station_ID LEFT JOIN officer o ON c.Officer_ID = o.Officer_ID WHERE 1=1';
    const params = [];

    if (status) { query += ' AND c.Case_Status = ?'; params.push(status); }
    if (search) { query += ' AND (c.Description LIKE ? OR c.Case_Status LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM cases WHERE 1=1${status ? ' AND Case_Status = ?' : ''}${search ? ' AND (Description LIKE ? OR Case_Status LIKE ?)' : ''}`, params.slice());

    query += ' ORDER BY c.Case_Date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getCaseById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT c.*, ps.Station_Name, o.Officer_Name FROM cases c LEFT JOIN police_station ps ON c.Station_ID = ps.Station_ID LEFT JOIN officer o ON c.Officer_ID = o.Officer_ID WHERE c.Case_ID = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, data: rows[0] });
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
    const [result] = await db.query(
      'INSERT INTO cases (Case_Date, Case_Status, Description, Station_ID, Officer_ID) VALUES (?, ?, ?, ?, ?)',
      [Case_Date, Case_Status, Description, Station_ID, Officer_ID]
    );
    res.status(201).json({ success: true, message: 'Case created.', Case_ID: result.insertId });
  } catch (err) {
    next(err);
  }
};

const updateCase = async (req, res, next) => {
  const { Case_Date, Case_Status, Description, Station_ID, Officer_ID } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE cases SET Case_Date = ?, Case_Status = ?, Description = ?, Station_ID = ?, Officer_ID = ? WHERE Case_ID = ?',
      [Case_Date, Case_Status, Description, Station_ID, Officer_ID, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, message: 'Case updated.' });
  } catch (err) {
    next(err);
  }
};

const deleteCase = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM cases WHERE Case_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.status(200).json({ success: true, message: 'Case deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── CRIMINAL ─────────────────────────────────────────────────────────────────

const getCriminals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || null;

    let where = 'WHERE 1=1';
    const params = [];
    if (search) { where += ' AND (Criminal_Name LIKE ? OR Address LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM criminal ${where}`, params.slice());
    const [rows] = await db.query(`SELECT * FROM criminal ${where} ORDER BY Criminal_ID DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getCriminalById = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM criminal WHERE Criminal_ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const createCriminal = async (req, res, next) => {
  const { Criminal_Name, Gender, DOB, Address } = req.body;
  if (!Criminal_Name) return res.status(400).json({ success: false, message: 'Criminal_Name is required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO criminal (Criminal_Name, Gender, DOB, Address) VALUES (?, ?, ?, ?)',
      [Criminal_Name, Gender, DOB, Address]
    );
    res.status(201).json({ success: true, message: 'Criminal created.', Criminal_ID: result.insertId });
  } catch (err) {
    next(err);
  }
};

const updateCriminal = async (req, res, next) => {
  const { Criminal_Name, Gender, DOB, Address } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE criminal SET Criminal_Name = ?, Gender = ?, DOB = ?, Address = ? WHERE Criminal_ID = ?',
      [Criminal_Name, Gender, DOB, Address, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, message: 'Criminal updated.' });
  } catch (err) {
    next(err);
  }
};

const deleteCriminal = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM criminal WHERE Criminal_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Criminal not found.' });
    res.status(200).json({ success: true, message: 'Criminal deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── VICTIM ───────────────────────────────────────────────────────────────────

const getVictims = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM victim');
    const [rows] = await db.query('SELECT * FROM victim ORDER BY Victim_ID DESC LIMIT ? OFFSET ?', [limit, offset]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getVictimById = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM victim WHERE Victim_ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const createVictim = async (req, res, next) => {
  const { Victim_Name, Gender, Phone, Address } = req.body;
  if (!Victim_Name) return res.status(400).json({ success: false, message: 'Victim_Name is required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO victim (Victim_Name, Gender, Phone, Address) VALUES (?, ?, ?, ?)',
      [Victim_Name, Gender, Phone, Address]
    );
    res.status(201).json({ success: true, message: 'Victim created.', Victim_ID: result.insertId });
  } catch (err) {
    next(err);
  }
};

const updateVictim = async (req, res, next) => {
  const { Victim_Name, Gender, Phone, Address } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE victim SET Victim_Name = ?, Gender = ?, Phone = ?, Address = ? WHERE Victim_ID = ?',
      [Victim_Name, Gender, Phone, Address, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, message: 'Victim updated.' });
  } catch (err) {
    next(err);
  }
};

const deleteVictim = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM victim WHERE Victim_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Victim not found.' });
    res.status(200).json({ success: true, message: 'Victim deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── EVIDENCE ─────────────────────────────────────────────────────────────────

const getEvidence = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const caseId = req.query.case_id || null;

    let where = 'WHERE 1=1';
    const params = [];
    if (caseId) { where += ' AND Case_ID = ?'; params.push(caseId); }

    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM evidence ${where}`, params.slice());
    const [rows] = await db.query(`SELECT * FROM evidence ${where} LIMIT ? OFFSET ?`, [...params, limit, offset]);
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getEvidenceById = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM evidence WHERE Evidence_ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const createEvidence = async (req, res, next) => {
  const { Evidence_Type, Description, Case_ID } = req.body;
  if (!Evidence_Type || !Case_ID) return res.status(400).json({ success: false, message: 'Evidence_Type and Case_ID are required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO evidence (Evidence_Type, Description, Case_ID) VALUES (?, ?, ?)',
      [Evidence_Type, Description, Case_ID]
    );
    res.status(201).json({ success: true, message: 'Evidence created.', Evidence_ID: result.insertId });
  } catch (err) {
    next(err);
  }
};

const updateEvidence = async (req, res, next) => {
  const { Evidence_Type, Description, Case_ID } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE evidence SET Evidence_Type = ?, Description = ?, Case_ID = ? WHERE Evidence_ID = ?',
      [Evidence_Type, Description, Case_ID, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, message: 'Evidence updated.' });
  } catch (err) {
    next(err);
  }
};

const deleteEvidence = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM evidence WHERE Evidence_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.status(200).json({ success: true, message: 'Evidence deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── ARREST ───────────────────────────────────────────────────────────────────

const getArrests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM arrest');
    const [rows] = await db.query(
      `SELECT a.*, cr.Criminal_Name, c.Case_Status FROM arrest a
       LEFT JOIN criminal cr ON a.Criminal_ID = cr.Criminal_ID
       LEFT JOIN cases c ON a.Case_ID = c.Case_ID
       ORDER BY a.Arrest_Date DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getArrestById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, cr.Criminal_Name, c.Case_Status FROM arrest a
       LEFT JOIN criminal cr ON a.Criminal_ID = cr.Criminal_ID
       LEFT JOIN cases c ON a.Case_ID = c.Case_ID
       WHERE a.Arrest_ID = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const createArrest = async (req, res, next) => {
  const { Arrest_Date, Criminal_ID, Case_ID } = req.body;
  if (!Arrest_Date || !Criminal_ID || !Case_ID) return res.status(400).json({ success: false, message: 'Arrest_Date, Criminal_ID, and Case_ID are required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO arrest (Arrest_Date, Criminal_ID, Case_ID) VALUES (?, ?, ?)',
      [Arrest_Date, Criminal_ID, Case_ID]
    );
    res.status(201).json({ success: true, message: 'Arrest record created.', Arrest_ID: result.insertId });
  } catch (err) {
    next(err);
  }
};

const updateArrest = async (req, res, next) => {
  const { Arrest_Date, Criminal_ID, Case_ID } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE arrest SET Arrest_Date = ?, Criminal_ID = ?, Case_ID = ? WHERE Arrest_ID = ?',
      [Arrest_Date, Criminal_ID, Case_ID, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, message: 'Arrest record updated.' });
  } catch (err) {
    next(err);
  }
};

const deleteArrest = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM arrest WHERE Arrest_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Arrest record not found.' });
    res.status(200).json({ success: true, message: 'Arrest record deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── FIR ──────────────────────────────────────────────────────────────────────

const getFIRs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM fir');
    const [rows] = await db.query(
      `SELECT f.*, v.Victim_Name, c.Case_Status FROM fir f
       LEFT JOIN victim v ON f.Victim_ID = v.Victim_ID
       LEFT JOIN cases c ON f.Case_ID = c.Case_ID
       ORDER BY f.FIR_Date DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getFIRById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT f.*, v.Victim_Name, c.Case_Status, c.Description FROM fir f
       LEFT JOIN victim v ON f.Victim_ID = v.Victim_ID
       LEFT JOIN cases c ON f.Case_ID = c.Case_ID
       WHERE f.FIR_No = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'FIR not found.' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const createFIR = async (req, res, next) => {
  const { FIR_Date, Case_ID, Victim_ID } = req.body;
  if (!FIR_Date || !Case_ID || !Victim_ID) return res.status(400).json({ success: false, message: 'FIR_Date, Case_ID, and Victim_ID are required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO fir (FIR_Date, Case_ID, Victim_ID) VALUES (?, ?, ?)',
      [FIR_Date, Case_ID, Victim_ID]
    );
    res.status(201).json({ success: true, message: 'FIR created.', FIR_No: result.insertId });
  } catch (err) {
    next(err);
  }
};

// FIR UPDATE is BLOCKED per business rules
const updateFIR = (req, res) => {
  return res.status(403).json({ success: false, message: 'FIR records cannot be updated. This action is not permitted.' });
};

const deleteFIR = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM fir WHERE FIR_No = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'FIR not found.' });
    res.status(200).json({ success: true, message: 'FIR deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── POLICE STATION ───────────────────────────────────────────────────────────

const getStations = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM police_station ORDER BY Station_ID');
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

const getStationById = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM police_station WHERE Station_ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const createStation = async (req, res, next) => {
  const { Station_Name, Location, Contact_No } = req.body;
  if (!Station_Name) return res.status(400).json({ success: false, message: 'Station_Name is required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO police_station (Station_Name, Location, Contact_No) VALUES (?, ?, ?)',
      [Station_Name, Location, Contact_No]
    );
    res.status(201).json({ success: true, message: 'Station created.', Station_ID: result.insertId });
  } catch (err) {
    next(err);
  }
};

const updateStation = async (req, res, next) => {
  const { Station_Name, Location, Contact_No } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE police_station SET Station_Name = ?, Location = ?, Contact_No = ? WHERE Station_ID = ?',
      [Station_Name, Location, Contact_No, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, message: 'Station updated.' });
  } catch (err) {
    next(err);
  }
};

const deleteStation = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM police_station WHERE Station_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Station not found.' });
    res.status(200).json({ success: true, message: 'Station deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── OFFICER ──────────────────────────────────────────────────────────────────

const getOfficers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM officer');
    const [rows] = await db.query(
      `SELECT o.*, ps.Station_Name FROM officer o
       LEFT JOIN police_station ps ON o.Station_ID = ps.Station_ID
       ORDER BY o.Officer_ID LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    res.status(200).json({ success: true, total, page, limit, data: rows });
  } catch (err) {
    next(err);
  }
};

const getOfficerById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT o.*, ps.Station_Name FROM officer o LEFT JOIN police_station ps ON o.Station_ID = ps.Station_ID WHERE o.Officer_ID = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Officer not found.' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const createOfficer = async (req, res, next) => {
  const { Officer_Name, Officer_Rank, Phone, Station_ID } = req.body;
  if (!Officer_Name || !Station_ID) return res.status(400).json({ success: false, message: 'Officer_Name and Station_ID are required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO officer (Officer_Name, Officer_Rank, Phone, Station_ID) VALUES (?, ?, ?, ?)',
      [Officer_Name, Officer_Rank, Phone, Station_ID]
    );
    res.status(201).json({ success: true, message: 'Officer created.', Officer_ID: result.insertId });
  } catch (err) {
    next(err);
  }
};

const updateOfficer = async (req, res, next) => {
  const { Officer_Name, Officer_Rank, Phone, Station_ID } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE officer SET Officer_Name = ?, Officer_Rank = ?, Phone = ?, Station_ID = ? WHERE Officer_ID = ?',
      [Officer_Name, Officer_Rank, Phone, Station_ID, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Officer not found.' });
    res.status(200).json({ success: true, message: 'Officer updated.' });
  } catch (err) {
    next(err);
  }
};

const deleteOfficer = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM officer WHERE Officer_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Officer not found.' });
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
