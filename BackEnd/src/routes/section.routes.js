const express = require('express');
const sectionController = require('../controllers/section.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.put('/reorder', sectionController.reorderSections);

router.route('/:id')
  .patch(sectionController.updateSection)
  .put(sectionController.updateSection)
  .delete(sectionController.deleteSection);

router.patch('/:id/move', sectionController.moveSection);
router.put('/:id/move', sectionController.moveSection);
router.get('/:id/notes', sectionController.getSectionNotes);

module.exports = router;
