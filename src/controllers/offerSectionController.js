// const OfferSection = require('../models/OfferSection');
// const { ftpOffer } = require('../util/ftpOffer');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // temp storage, you can customize

// // Middleware for handling multipart/form-data
// exports.uploadOfferFiles = upload.fields([
//   { name: 'backgroundImage', maxCount: 1 },
//   { name: 'biryaniImage', maxCount: 1 },
// ]);

// // Create new offer section
// exports.createOfferSection = async (req, res) => {
//   try {
//     console.log('Body:', req.body);
//     console.log('Files:', req.files);

//     const { title, subtitle, description, buckets, isActive } = req.body;

//     // Upload images if files exist
//     let backgroundImage = null;
//     let biryaniImage = null;
//     if (req.files?.backgroundImage?.[0]) {
//       backgroundImage = await ftpOffer(req.files.backgroundImage[0]);
//     }
//     if (req.files?.biryaniImage?.[0]) {
//       biryaniImage = await ftpOffer(req.files.biryaniImage[0]);
//     }

//     // Parse buckets
//     let parsedBuckets = [];
//     if (buckets) {
//       parsedBuckets = typeof buckets === 'string' ? JSON.parse(buckets) : buckets;
//     }

//     // Convert isActive to 0/1
//     const activeStatus = (isActive === true || isActive === 'true' || isActive === 1 || isActive === '1') ? 1 : 0;

//     // Prepare data for DB
//     const offerData = {
//       title,
//       subtitle,
//       description,
//       buckets: parsedBuckets,
//       backgroundImage,
//       biryaniImage,
//       isActive: activeStatus,
//     };

//     try {
//       const result = await OfferSection.create(req.body);
//       return res.status(201).json({ success: true, data: result });
//     } catch (err) {
//       return res.status(500).json({ success: false, message: err.message });
//     }

//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Update offer section
// exports.updateOfferSection = async (req, res) => {
//   try {
//     console.log('Body:', req.body);
//     console.log('Files:', req.files);

//     const { title, subtitle, description, buckets, isActive } = req.body;

//     // Handle images
//     let backgroundImage = req.body.backgroundImage || null;
//     let biryaniImage = req.body.biryaniImage || null;

//     if (req.files?.backgroundImage?.[0]) {
//       backgroundImage = await ftpOffer(req.files.backgroundImage[0]);
//     }

//     if (req.files?.biryaniImage?.[0]) {
//       biryaniImage = await ftpOffer(req.files.biryaniImage[0]);
//     }

//     // Parse buckets
//     let parsedBuckets = [];
//     if (buckets) {
//       parsedBuckets = typeof buckets === 'string' ? JSON.parse(buckets) : buckets;
//     }

//     const activeStatus = (isActive === true || isActive === 'true' || isActive === 1 || isActive === '1') ? 1 : 0;

//     const offerData = {
//       title,
//       subtitle,
//       description,
//       buckets: parsedBuckets,
//       backgroundImage,
//       biryaniImage,
//       isActive: activeStatus,
//     };

//     OfferSection.update(req.params.id, offerData, (err, result) => {
//       if (err) return res.status(500).json({ success: false, message: err.message });
//       return res.status(200).json({ success: true, data: result });
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Delete offer section
// exports.deleteOfferSection = async (req, res) => {
//   try {
//     OfferSection.delete(req.params.id, (err, result) => {
//       if (err) return res.status(500).json({ success: false, message: err.message });
//       if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Offer section not found' });
//       return res.status(200).json({ success: true, message: 'Offer section deleted successfully' });
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Get all offer sections
// exports.getAllOfferSections = async (req, res) => {
//   try {
//     OfferSection.findAll((err, sections) => {
//       if (err) return res.status(500).json({ success: false, message: err.message });
//       return res.status(200).json({ success: true, data: sections });
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Get offer section by ID
// exports.getOfferSectionById = async (req, res) => {
//   try {
//     OfferSection.findById(req.params.id, (err, section) => {
//       if (err) return res.status(500).json({ success: false, message: err.message });
//       if (!section) return res.status(404).json({ success: false, message: 'Offer section not found' });
//       return res.status(200).json({ success: true, data: section });
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Get active offer section
// exports.getActiveOfferSection = async (req, res) => {
//   try {
//     OfferSection.findActive((err, section) => {
//       if (err) return res.status(500).json({ success: false, message: err.message });
//       return res.status(200).json({ success: true, data: section });
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };


const OfferSection = require('../models/OfferSection');
const { ftpOffer } = require('../util/ftpOffer');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// ✅ Middleware for file upload
exports.uploadOfferFiles = upload.fields([
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'biryaniImage', maxCount: 1 },
]);

// ✅ CREATE
exports.createOfferSection = async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { title, subtitle, description, buckets, isActive } = req.body;

    let backgroundImage = null;
    let biryaniImage = null;
    if (req.files?.backgroundImage?.[0]) {
      backgroundImage = await ftpOffer(req.files.backgroundImage[0]);
    }
    if (req.files?.biryaniImage?.[0]) {
      biryaniImage = await ftpOffer(req.files.biryaniImage[0]);
    }

    const parsedBuckets =
      typeof buckets === 'string' ? JSON.parse(buckets) : buckets || [];

    const activeStatus =
      isActive === true || isActive === 'true' || isActive == 1 ? 1 : 0;

    const offerData = {
      title,
      subtitle,
      description,
      buckets: parsedBuckets,
      backgroundImage,
      biryaniImage,
      isActive: activeStatus,
    };

    const result = await OfferSection.create(offerData);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ UPDATE
exports.updateOfferSection = async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { title, subtitle, description, buckets, isActive } = req.body;

    let backgroundImage = req.body.backgroundImage || null;
    let biryaniImage = req.body.biryaniImage || null;

    if (req.files?.backgroundImage?.[0]) {
      backgroundImage = await ftpOffer(req.files.backgroundImage[0]);
    }

    if (req.files?.biryaniImage?.[0]) {
      biryaniImage = await ftpOffer(req.files.biryaniImage[0]);
    }

    const parsedBuckets =
      typeof buckets === 'string' ? JSON.parse(buckets) : buckets || [];

    const activeStatus =
      isActive === true || isActive === 'true' || isActive == 1 ? 1 : 0;

    const offerData = {
      title,
      subtitle,
      description,
      buckets: parsedBuckets,
      backgroundImage,
      biryaniImage,
      isActive: activeStatus,
    };

    const result = await OfferSection.update(req.params.id, offerData);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET ALL
exports.getAllOfferSections = async (req, res) => {
  try {
    OfferSection.findAll((err, sections) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
      }
      return res.status(200).json({ success: true, data: sections });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET BY ID
exports.getOfferSectionById = async (req, res) => {
  try {
    OfferSection.findById(req.params.id, (err, section) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
      }
      if (!section)
        return res
          .status(404)
          .json({ success: false, message: 'Offer section not found' });
      return res.status(200).json({ success: true, data: section });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ DELETE
exports.deleteOfferSection = async (req, res) => {
  try {
    OfferSection.delete(req.params.id, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
      }
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ success: false, message: 'Offer section not found' });
      return res
        .status(200)
        .json({ success: true, message: 'Offer section deleted successfully' });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET ACTIVE
exports.getActiveOfferSection = async (req, res) => {
  try {
    OfferSection.findActive((err, section) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
      }
      return res.status(200).json({ success: true, data: section });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
