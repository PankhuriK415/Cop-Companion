const express = require('express');
const router = express.Router();
const ctrl = require('./victim.controller');
const validate = require('../../shared/middleware/validate.middleware');
const { victimSchema } = require('./victim.schema');

router.get('/data', ctrl.getVictimData);
router.get('/', ctrl.getVictims);
router.get('/:id', ctrl.getVictimById);
router.post('/', validate(victimSchema), ctrl.createVictim);
router.put('/:id', validate(victimSchema), ctrl.updateVictim);
router.delete('/:id', ctrl.deleteVictim);

module.exports = router;
