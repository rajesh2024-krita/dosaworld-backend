const db = require("../config/db");

class OfferSection {
  // Create new offer section with buckets
  static async create(data, callback) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      let { title, subtitle, description, backgroundImage, biryaniImage, isActive = 1, buckets } = data;

      // Sanitize images
      backgroundImage = (backgroundImage && typeof backgroundImage === 'string') ? backgroundImage : null;
      biryaniImage = (biryaniImage && typeof biryaniImage === 'string') ? biryaniImage : null;

      // Convert isActive to 0/1
      isActive = (isActive === true || isActive === 'true' || isActive === 1 || isActive === '1') ? 1 : 0;

      // Parse buckets if string
      if (typeof buckets === 'string') buckets = JSON.parse(buckets);
      buckets = Array.isArray(buckets) ? buckets : [];

      const [results] = await connection.query(
        `INSERT INTO offer_sections (title, subtitle, description, background_image, biryani_image, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title || null, subtitle || null, description || null, backgroundImage, biryaniImage, isActive]
      );

      const offerSectionId = results.insertId;

      // Insert buckets
      for (let i = 0; i < buckets.length; i++) {
        const bucket = buckets[i];
        if (!bucket.name || !bucket.people || !bucket.price) continue;
        const bucketSize = bucket.size || `bucket-${i + 1}`;
        await connection.query(
          `INSERT INTO buckets (offer_section_id, size, name, people, price) VALUES (?, ?, ?, ?, ?)`,
          [offerSectionId, bucketSize, bucket.name, bucket.people, bucket.price]
        );
      }

      await connection.commit();
      callback(null, { _id: offerSectionId, ...data });
    } catch (err) {
      await connection.rollback();
      callback(err);
    } finally {
      connection.release();
    }
  }

  // Update offer section
  static async update(id, data, callback) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      let { title, subtitle, description, backgroundImage, biryaniImage, isActive = 1, buckets } = data;

      // Sanitize images
      backgroundImage = (backgroundImage && typeof backgroundImage === 'string') ? backgroundImage : null;
      biryaniImage = (biryaniImage && typeof biryaniImage === 'string') ? biryaniImage : null;

      // Convert isActive to 0/1
      isActive = (isActive === true || isActive === 'true' || isActive === 1 || isActive === '1') ? 1 : 0;

      // Parse buckets if string
      if (typeof buckets === 'string') buckets = JSON.parse(buckets);
      buckets = Array.isArray(buckets) ? buckets : [];

      // Update main offer section
      await connection.query(
        `UPDATE offer_sections 
         SET title=?, subtitle=?, description=?, background_image=?, biryani_image=?, is_active=? 
         WHERE id=?`,
        [title || null, subtitle || null, description || null, backgroundImage, biryaniImage, isActive, id]
      );

      // Delete old buckets
      await connection.query("DELETE FROM buckets WHERE offer_section_id=?", [id]);

      // Insert new buckets
      for (let i = 0; i < buckets.length; i++) {
        const bucket = buckets[i];
        if (!bucket.name || !bucket.people || !bucket.price) continue;
        const bucketSize = bucket.size || `bucket-${i + 1}`;
        await connection.query(
          `INSERT INTO buckets (offer_section_id, size, name, people, price) VALUES (?, ?, ?, ?, ?)`,
          [id, bucketSize, bucket.name, bucket.people, bucket.price]
        );
      }

      await connection.commit();
      callback(null, { _id: id, ...data });
    } catch (err) {
      await connection.rollback();
      callback(err);
    } finally {
      connection.release();
    }
  }

  static delete(id, callback) {
    db.query("DELETE FROM offer_sections WHERE id=?", [id], callback);
  }

  static findAll(callback) {
    const query = `
      SELECT os.*, 
             GROUP_CONCAT(JSON_OBJECT('size', b.size, 'name', b.name, 'people', b.people, 'price', b.price)) AS buckets_data
      FROM offer_sections os
      LEFT JOIN buckets b ON os.id = b.offer_section_id
      GROUP BY os.id
      ORDER BY os.created_at DESC
    `;
    db.query(query, (err, results) => {
      if (err) return callback(err);
      const sections = results.map(row => {
        const buckets = {};
        if (row.buckets_data) JSON.parse(`[${row.buckets_data}]`).forEach(b => { buckets[b.size] = b; });
        return { 
          _id: row.id, 
          title: row.title, 
          subtitle: row.subtitle, 
          description: row.description, 
          backgroundImage: row.background_image, 
          biryaniImage: row.biryani_image, 
          isActive: !!row.is_active, 
          buckets, 
          createdAt: row.created_at, 
          updatedAt: row.updated_at 
        };
      });
      callback(null, sections);
    });
  }

  static findById(id, callback) {
    db.query(`SELECT * FROM offer_sections WHERE id=?`, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0] || null);
    });
  }

  static findActive(callback) {
    db.query(`SELECT * FROM offer_sections WHERE is_active=1 ORDER BY created_at DESC LIMIT 1`, callback);
  }
}

module.exports = OfferSection;
