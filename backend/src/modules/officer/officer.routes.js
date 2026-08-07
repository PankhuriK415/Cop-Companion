const express = require('express');
const router = express.Router();
const ctrl = require('./officer.controller');
const validate = require('../../shared/middleware/validate.middleware');
const { officerSchema } = require('./officer.schema');

router.get('/', ctrl.getOfficers);
router.get('/:id', ctrl.getOfficerById);
router.post('/', validate(officerSchema), ctrl.createOfficer);
router.put('/:id', validate(officerSchema), ctrl.updateOfficer);
router.delete('/:id', ctrl.deleteOfficer);
module.exports = router;
