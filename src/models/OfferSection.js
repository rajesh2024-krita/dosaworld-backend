
const db = require("../config/db");

class OfferSection {
  // ✅ Create new offer section
  static async create(data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      let { title, subtitle, description, backgroundImage, biryaniImage, isActive = 1, buckets } = data;

      backgroundImage = (typeof backgroundImage === 'string' && backgroundImage) ? backgroundImage : null;
      biryaniImage = (typeof biryaniImage === 'string' && biryaniImage) ? biryaniImage : null;

      // Boolean to integer
      isActive = ['true', true, 1, '1'].includes(isActive) ? 1 : 0;

      // Buckets parsing
      if (typeof buckets === 'string') buckets = JSON.parse(buckets);
      buckets = Array.isArray(buckets) ? buckets : [];

      // Insert main offer section
      const [result] = await connection.query(
        `INSERT INTO offer_sections (title, subtitle, description, biryani_image, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        [title || null, subtitle || null, description || null, biryaniImage, isActive]
      );

      const offerSectionId = result.insertId;

      // Insert buckets
      for (const [i, bucket] of buckets.entries()) {
        if (!bucket.name || !bucket.people || !bucket.price) continue;
        const bucketSize = bucket.size || `bucket-${i + 1}`;
        await connection.query(
          `INSERT INTO buckets (offer_section_id, size, name, people, price)
           VALUES (?, ?, ?, ?, ?)`,
          [offerSectionId, bucketSize, bucket.name, bucket.people, bucket.price]
        );
      }

      await connection.commit();
      return { success: true, _id: offerSectionId, ...data };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // ✅ Update offer section
  static async update(id, data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      let { title, subtitle, description, backgroundImage, biryaniImage, isActive = 1, buckets } = data;

      backgroundImage = (typeof backgroundImage === 'string' && backgroundImage) ? backgroundImage : null;
      biryaniImage = (typeof biryaniImage === 'string' && biryaniImage) ? biryaniImage : null;
      isActive = ['true', true, 1, '1'].includes(isActive) ? 1 : 0;

      if (typeof buckets === 'string') buckets = JSON.parse(buckets);
      buckets = Array.isArray(buckets) ? buckets : [];

      // Update section
      await connection.query(
        `UPDATE offer_sections
         SET title=?, subtitle=?, description=?, background_image=?, biryani_image=?, is_active=?
         WHERE id=?`,
        [title || null, subtitle || null, description || null, backgroundImage, biryaniImage, isActive, id]
      );

      // Delete + reinsert buckets
      await connection.query(`DELETE FROM buckets WHERE offer_section_id=?`, [id]);
      for (const [i, bucket] of buckets.entries()) {
        if (!bucket.name || !bucket.people || !bucket.price) continue;
        const bucketSize = bucket.size || `bucket-${i + 1}`;
        await connection.query(
          `INSERT INTO buckets (offer_section_id, size, name, people, price)
           VALUES (?, ?, ?, ?, ?)`,
          [id, bucketSize, bucket.name, bucket.people, bucket.price]
        );
      }

      await connection.commit();
      return { success: true, _id: id, ...data };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // ✅ The remaining methods can stay callback-based (simple reads)
  static delete(id, callback) {
    db.query(`DELETE FROM offer_sections WHERE id=?`, [id], callback);
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
      const sections = results.map(row => ({
        _id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        backgroundImage: row.background_image,
        biryaniImage: row.biryani_image,
        isActive: !!row.is_active,
        buckets: row.buckets_data ? JSON.parse(`[${row.buckets_data}]`) : [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
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
