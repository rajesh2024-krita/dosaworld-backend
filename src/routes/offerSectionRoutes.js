const express = require('express');
const router = express.Router();
const offerSectionController = require('../controllers/offerSectionController');

// CRUD routes
router.post('/offer-sections', offerSectionController.createOfferSection);
router.get('/offer-sections', offerSectionController.getAllOfferSections);
router.get('/offer-sections/active', offerSectionController.getActiveOfferSection);
router.get('/offer-sections/:id', offerSectionController.getOfferSectionById);
router.put('/offer-sections/:id', offerSectionController.updateOfferSection);
router.delete('/offer-sections/:id', offerSectionController.deleteOfferSection);

module.exports = router;