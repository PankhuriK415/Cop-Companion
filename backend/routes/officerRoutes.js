const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/officerController');

// All officer routes require valid JWT + officer role
router.use(verifyToken, authorizeRoles(['officer']));

// ─── AGGREGATE ────────────────────────────────────────────────────────────────
router.get('/all-data', ctrl.getAllData);

// ─── CASES ────────────────────────────────────────────────────────────────────
router.get('/cases', ctrl.getCases);
router.get('/cases/:id', ctrl.getCaseById);
router.post('/cases', ctrl.createCase);
router.put('/cases/:id', ctrl.updateCase);
router.delete('/cases/:id', ctrl.deleteCase);

// ─── CRIMINAL ─────────────────────────────────────────────────────────────────
router.get('/criminals', ctrl.getCriminals);
router.get('/criminals/:id', ctrl.getCriminalById);
router.post('/criminals', ctrl.createCriminal);
router.put('/criminals/:id', ctrl.updateCriminal);
router.delete('/criminals/:id', ctrl.deleteCriminal);

// ─── VICTIM ───────────────────────────────────────────────────────────────────
router.get('/victims', ctrl.getVictims);
router.get('/victims/:id', ctrl.getVictimById);
router.post('/victims', ctrl.createVictim);
router.put('/victims/:id', ctrl.updateVictim);
router.delete('/victims/:id', ctrl.deleteVictim);

// ─── EVIDENCE ─────────────────────────────────────────────────────────────────
router.get('/evidence', ctrl.getEvidence);
router.get('/evidence/:id', ctrl.getEvidenceById);
router.post('/evidence', ctrl.createEvidence);
router.put('/evidence/:id', ctrl.updateEvidence);
router.delete('/evidence/:id', ctrl.deleteEvidence);

// ─── ARREST ───────────────────────────────────────────────────────────────────
router.get('/arrests', ctrl.getArrests);
router.get('/arrests/:id', ctrl.getArrestById);
router.post('/arrests', ctrl.createArrest);
router.put('/arrests/:id', ctrl.updateArrest);
router.delete('/arrests/:id', ctrl.deleteArrest);

// ─── FIR (UPDATE BLOCKED) ─────────────────────────────────────────────────────
router.get('/firs', ctrl.getFIRs);
router.get('/firs/:id', ctrl.getFIRById);
router.post('/firs', ctrl.createFIR);
router.put('/firs/:id', ctrl.updateFIR);       // Returns 403
router.patch('/firs/:id', ctrl.updateFIR);     // Returns 403
router.delete('/firs/:id', ctrl.deleteFIR);

// ─── POLICE STATION ───────────────────────────────────────────────────────────
router.get('/stations', ctrl.getStations);
router.get('/stations/:id', ctrl.getStationById);
router.post('/stations', ctrl.createStation);
router.put('/stations/:id', ctrl.updateStation);
router.delete('/stations/:id', ctrl.deleteStation);

// ─── OFFICER ──────────────────────────────────────────────────────────────────
router.get('/officers', ctrl.getOfficers);
router.get('/officers/:id', ctrl.getOfficerById);
router.post('/officers', ctrl.createOfficer);
router.put('/officers/:id', ctrl.updateOfficer);
router.delete('/officers/:id', ctrl.deleteOfficer);

module.exports = router;
