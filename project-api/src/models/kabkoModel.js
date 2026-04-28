const db = require('../config/db');

const KabkoModel = {
  // Ambil semua kabkot, urutkan nama_kabkot
  getAll: async () => {
    const result = await db.query(
      `SELECT k.*, p.nama_provinsi
       FROM kabkot k
       JOIN provinsi p ON k.provinsi_id = p.id
       ORDER BY k.nama_kabkot ASC`
    );
    return result.rows;
  },

  // Ambil kabkot by ID
  getById: async (id) => {
    const result = await db.query(
      `SELECT k.*, p.nama_provinsi
       FROM kabkot k
       JOIN provinsi p ON k.provinsi_id = p.id
       WHERE k.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Ambil kabkot berdasarkan provinsi_id (untuk AJAX dropdown)
  getByProvinsiId: async (provinsi_id) => {
    const result = await db.query(
      'SELECT id, nama_kabkot FROM kabkot WHERE provinsi_id = $1 ORDER BY nama_kabkot ASC',
      [provinsi_id]
    );
    return result.rows;
  },

  // Buat kabkot baru
  create: async ({ provinsi_id, nama_kabkot }) => {
    const result = await db.query(
      'INSERT INTO kabkot (provinsi_id, nama_kabkot, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [provinsi_id, nama_kabkot]
    );
    return result.rows[0];
  },

  // Update kabkot
  update: async (id, { provinsi_id, nama_kabkot }) => {
    const result = await db.query(
      'UPDATE kabkot SET provinsi_id = $1, nama_kabkot = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [provinsi_id, nama_kabkot, id]
    );
    return result.rows[0];
  },

  // Hapus kabkot
  delete: async (id) => {
    const result = await db.query(
      'DELETE FROM kabkot WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = KabkoModel;
