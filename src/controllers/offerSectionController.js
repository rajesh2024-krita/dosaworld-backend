const OfferSection = require('../models/OfferSection');
const { ftpOffer } = require('../util/ftpOffer');

// Create new offer section
exports.createOfferSection = async (req, res) => {
  try {
    let { buckets, isActive } = req.body;

    // Upload images if files exist
    if (req.files?.backgroundImage?.[0]) {
      req.body.backgroundImage = await ftpOffer(req.files.backgroundImage[0]);
    } else req.body.backgroundImage = null;

    if (req.files?.biryaniImage?.[0]) {
      req.body.biryaniImage = await ftpOffer(req.files.biryaniImage[0]);
    } else req.body.biryaniImage = null;

    // Parse buckets if string
    if (typeof buckets === "string") buckets = JSON.parse(buckets);
    req.body.buckets = buckets || [];

    // Convert isActive to 0/1
    req.body.isActive = (isActive === true || isActive === 'true' || isActive === 1 || isActive === '1') ? 1 : 0;

    OfferSection.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.status(201).json({ success: true, data: result });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update offer section
exports.updateOfferSection = async (req, res) => {
  try {
    let { buckets, isActive } = req.body;

    // Upload images if files exist
    if (req.files?.backgroundImage?.[0]) {
      req.body.backgroundImage = await ftpOffer(req.files.backgroundImage[0]);
    } else if (!req.body.backgroundImage) req.body.backgroundImage = null;

    if (req.files?.biryaniImage?.[0]) {
      req.body.biryaniImage = await ftpOffer(req.files.biryaniImage[0]);
    } else if (!req.body.biryaniImage) req.body.biryaniImage = null;

    // Parse buckets if string
    if (typeof buckets === "string") buckets = JSON.parse(buckets);
    req.body.buckets = buckets || [];

    // Convert isActive to 0/1
    req.body.isActive = (isActive === true || isActive === 'true' || isActive === 1 || isActive === '1') ? 1 : 0;

    OfferSection.update(req.params.id, req.body, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.status(200).json({ success: true, data: result });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete offer section
exports.deleteOfferSection = async (req, res) => {
  try {
    OfferSection.delete(req.params.id, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Offer section not found' });
      return res.status(200).json({ success: true, message: 'Offer section deleted successfully' });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get all offer sections
exports.getAllOfferSections = async (req, res) => {
  try {
    OfferSection.findAll((err, sections) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.status(200).json({ success: true, data: sections });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get offer section by ID
exports.getOfferSectionById = async (req, res) => {
  try {
    OfferSection.findById(req.params.id, (err, section) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!section) return res.status(404).json({ success: false, message: 'Offer section not found' });
      return res.status(200).json({ success: true, data: section });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get active offer section
exports.getActiveOfferSection = async (req, res) => {
  try {
    OfferSection.findActive((err, section) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.status(200).json({ success: true, data: section });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
