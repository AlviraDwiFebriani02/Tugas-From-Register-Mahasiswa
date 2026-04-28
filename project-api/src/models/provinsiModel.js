const db = require('../config/db');

const ProvinsiModel = {
  // Ambil semua provinsi, urutkan nama_provinsi
  getAll: async () => {
    const result = await db.query(
      'SELECT * FROM provinsi ORDER BY nama_provinsi ASC'
    );
    return result.rows;
  },

  // Ambil provinsi by ID
  getById: async (id) => {
    const result = await db.query(
      'SELECT * FROM provinsi WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Buat provinsi baru
  create: async ({ nama_provinsi }) => {
    const result = await db.query(
      'INSERT INTO provinsi (nama_provinsi, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *',
      [nama_provinsi]
    );
    return result.rows[0];
  },

  // Update provinsi
  update: async (id, { nama_provinsi }) => {
    const result = await db.query(
      'UPDATE provinsi SET nama_provinsi = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [nama_provinsi, id]
    );
    return result.rows[0];
  },

  // Hapus provinsi
  delete: async (id) => {
    const result = await db.query(
      'DELETE FROM provinsi WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = ProvinsiModel;
