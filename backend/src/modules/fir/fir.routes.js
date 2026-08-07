const express = require('express');
const router = express.Router();
const ctrl = require('./fir.controller');
const validate = require('../../shared/middleware/validate.middleware');
const { firSchema } = require('./fir.schema');
router.get('/', ctrl.getFIRs);
router.get('/:id', ctrl.getFIRById);
router.post('/', validate(firSchema), ctrl.createFIR);
router.put('/:id', ctrl.updateFIR);       // Returns 403
router.patch('/:id', ctrl.updateFIR);     // Returns 403
router.delete('/:id', ctrl.deleteFIR);
module.exports = router;
