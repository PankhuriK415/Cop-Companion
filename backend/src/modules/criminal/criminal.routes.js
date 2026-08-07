const express = require('express');
const router = express.Router();
const ctrl = require('./criminal.controller');
const validate = require('../../shared/middleware/validate.middleware');
const { criminalSchema } = require('./criminal.schema');

router.get('/status', ctrl.getCriminalStatus);
router.get('/', ctrl.getCriminals);
router.get('/:id', ctrl.getCriminalById);
router.post('/', validate(criminalSchema), ctrl.createCriminal);
router.put('/:id', validate(criminalSchema), ctrl.updateCriminal);
router.delete('/:id', ctrl.deleteCriminal);

module.exports = router;
