// const express = require('express');
// const router = express.Router();
// const offerSectionController = require('../controllers/offerSectionController');

// // CRUD routes
// router.post('/', offerSectionController.createOfferSection);
// router.get('/', offerSectionController.getAllOfferSections);
// router.get('/active', offerSectionController.getActiveOfferSection);
// router.get('/:id', offerSectionController.getOfferSectionById);
// router.put('/:id', offerSectionController.updateOfferSection);
// router.delete('/:id', offerSectionController.deleteOfferSection);

// module.exports = router;

const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerSectionController');
const upload = require("../middleware/upload");

router.post('/', upload.fields([
    { name: 'biryaniImage', maxCount: 1 },
  ]),
  offerController.createOfferSection);
router.put('/:id', upload.fields([
    { name: 'biryaniImage', maxCount: 1 },
  ]),
  offerController.updateOfferSection);
router.delete('/:id', offerController.deleteOfferSection);
router.get('/', offerController.getAllOfferSections);
router.get('/active', offerController.getActiveOfferSection);
router.get('/:id', offerController.getOfferSectionById);

module.exports = router;
