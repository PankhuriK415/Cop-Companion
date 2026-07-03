const express = require('express');
const router = express.Router();
const ctrl = require('./case.controller');
const validate = require('../../shared/middleware/validate.middleware');
const { caseSchema } = require('./case.schema');

router.get('/', ctrl.getCases);
router.get('/:id', ctrl.getCaseById);
router.post('/', validate(caseSchema), ctrl.createCase);
router.put('/:id', validate(caseSchema), ctrl.updateCase);
router.delete('/:id', ctrl.deleteCase);

module.exports = router;
