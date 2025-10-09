const db = require("../config/db");

class OfferSection {
  // ✅ Create new offer section - FIXED
  static async create(data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      let {
        title,
        subtitle,
        description,
        backgroundImage,
        biryaniImage,
        isActive = 1,
        buckets,
      } = data;

      // ✅ Validate required fields
      if (!title || !subtitle || !description) {
        throw new Error("Title, subtitle, and description are required");
      }

      backgroundImage =
        typeof backgroundImage === "string" && backgroundImage
          ? backgroundImage
          : null;
      biryaniImage =
        typeof biryaniImage === "string" && biryaniImage ? biryaniImage : null;

      // Boolean to integer
      isActive = ["true", true, 1, "1"].includes(isActive) ? 1 : 0;

      // Buckets parsing - ensure it's an array
      if (typeof buckets === "string") {
        try {
          buckets = JSON.parse(buckets);
        } catch (e) {
          buckets = [];
        }
      }
      buckets = Array.isArray(buckets) ? buckets : [];

      // ✅ Validate buckets
      if (buckets.length === 0) {
        throw new Error("At least one bucket is required");
      }

      console.log("Inserting offer section with:", {
        title,
        subtitle,
        description,
        biryaniImage,
        isActive,
      });

      // Insert main offer section
      const [result] = await connection.query(
        `INSERT INTO offer_sections (title, subtitle, description, background_image, biryani_image, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, subtitle, description, backgroundImage, biryaniImage, isActive]
      );

      const offerSectionId = result.insertId;

      // Insert buckets
      for (const [i, bucket] of buckets.entries()) {
        if (!bucket.name || !bucket.people || !bucket.price) {
          console.warn(`Skipping invalid bucket at index ${i}:`, bucket);
          continue;
        }
        const bucketSize = bucket.size || `bucket-${i + 1}`;
        await connection.query(
          `INSERT INTO buckets (offer_section_id, size, name, people, price)
           VALUES (?, ?, ?, ?, ?)`,
          [offerSectionId, bucketSize, bucket.name, bucket.people, bucket.price]
        );
      }

      await connection.commit();

      // Return the created section with proper structure
      return {
        _id: offerSectionId,
        title,
        subtitle,
        description,
        backgroundImage,
        biryaniImage,
        isActive: !!isActive,
        buckets: buckets.map((bucket, i) => ({
          ...bucket,
          size: bucket.size || `bucket-${i + 1}`,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // ✅ Update offer section - FIXED
  static async update(id, data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Fetch existing record
      const [existingRows] = await connection.query(
        `SELECT * FROM offer_sections WHERE id=?`,
        [id]
      );
      const existing = existingRows[0];
      if (!existing) throw new Error("Offer section not found");

      // Extract fields from input
      let {
        title,
        subtitle,
        description,
        backgroundImage,
        biryaniImage,
        isActive,
        buckets,
      } = data;

      // ✅ Fallback to existing values if not provided
      title = title || existing.title;
      subtitle = subtitle || existing.subtitle;
      description = description || existing.description;
      backgroundImage = backgroundImage || existing.background_image;
      biryaniImage = biryaniImage || existing.biryani_image;
      isActive =
        isActive !== undefined
          ? ["true", true, 1, "1"].includes(isActive)
            ? 1
            : 0
          : existing.is_active;

      // ✅ Buckets handling (optional)
      if (typeof buckets === "string") {
        try {
          buckets = JSON.parse(buckets);
        } catch {
          buckets = [];
        }
      }

      // If no new buckets provided, keep old buckets
      if (!Array.isArray(buckets) || buckets.length === 0) {
        const [oldBuckets] = await connection.query(
          `SELECT size, name, people, price FROM buckets WHERE offer_section_id=?`,
          [id]
        );
        buckets = oldBuckets || [];
      }

      // ✅ Update main section
      await connection.query(
        `UPDATE offer_sections
       SET title=?, subtitle=?, description=?, background_image=?, biryani_image=?, is_active=?, updated_at=NOW()
       WHERE id=?`,
        [
          title,
          subtitle,
          description,
          backgroundImage,
          biryaniImage,
          isActive,
          id,
        ]
      );

      // ✅ Replace buckets only if new provided
      if (buckets.length > 0) {
        await connection.query(`DELETE FROM buckets WHERE offer_section_id=?`, [
          id,
        ]);
        for (const [i, bucket] of buckets.entries()) {
          if (!bucket.name || !bucket.people || !bucket.price) continue;
          const bucketSize = bucket.size || `bucket-${i + 1}`;
          await connection.query(
            `INSERT INTO buckets (offer_section_id, size, name, people, price)
           VALUES (?, ?, ?, ?, ?)`,
            [id, bucketSize, bucket.name, bucket.people, bucket.price]
          );
        }
      }

      await connection.commit();

      return {
        _id: parseInt(id),
        title,
        subtitle,
        description,
        backgroundImage,
        biryaniImage,
        isActive: !!isActive,
        buckets,
        updatedAt: new Date(),
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // ✅ Improved findAll to handle bucket structure properly
  static findAll(callback) {
    const query = `
    SELECT 
      os.*,
      GROUP_CONCAT(
        JSON_OBJECT(
          'size', COALESCE(b.size, 'S'),
          'name', b.name,
          'people', b.people,
          'price', b.price
        )
      ) AS buckets_data
    FROM offer_sections os
    LEFT JOIN buckets b ON os.id = b.offer_section_id
    GROUP BY os.id
    ORDER BY os.created_at DESC
  `;

    db.query(query, (err, results) => {
      if (err) return callback(err);

      const sections = results.map((row) => {
        let buckets = [];
        if (row.buckets_data) {
          try {
            // parse GROUP_CONCAT JSON_OBJECTs into array
            const bucketsArray = JSON.parse(`[${row.buckets_data}]`);
            buckets = bucketsArray.map((bucket) => ({
              size: bucket.size,
              name: bucket.name,
              people: bucket.people,
              price: bucket.price,
            }));
          } catch (e) {
            console.error("Error parsing buckets:", e);
            buckets = [];
          }
        }

        return {
          _id: row.id,
          title: row.title,
          subtitle: row.subtitle,
          description: row.description,
          backgroundImage: row.background_image,
          biryaniImage: row.biryani_image,
          isActive: !!row.is_active,
          buckets, // ✅ now array of buckets
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      });

      callback(null, sections);
    });
  }

  static async delete(id) {
    const connection = await db.getConnection();
    try {
      // 1️⃣ Fetch the existing offer section
      const [rows] = await connection.query(
        `SELECT * FROM offer_sections WHERE id=?`,
        [id]
      );
      if (rows.length === 0) {
        return null; // Not found
      }
      const offerSection = rows[0];

      // 2️⃣ Delete related buckets first (if needed)
      await connection.query(`DELETE FROM buckets WHERE offer_section_id=?`, [
        id,
      ]);

      // 3️⃣ Delete the offer section
      await connection.query(`DELETE FROM offer_sections WHERE id=?`, [id]);

      // 4️⃣ Return the deleted data
      return offerSection;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const connection = await db.getConnection();
    try {
      const [results] = await connection.query(
        `SELECT * FROM offer_sections WHERE id=?`,
        [id]
      );
      return results[0] || null;
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  static findActive(callback) {
    db.query(
      `SELECT * FROM offer_sections WHERE is_active=1 ORDER BY created_at DESC LIMIT 1`,
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0] || null);
      }
    );
  }
}

module.exports = OfferSection;
