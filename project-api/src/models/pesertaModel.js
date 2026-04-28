const db = require('../config/db');

const PesertaModel = {
  // Ambil semua peserta beserta relasi provinsi & kabkot
  getAll: async () => {
    const result = await db.query(
      `SELECT
         pe.*,
         pr.nama_provinsi,
         kb.nama_kabkot,
         CASE pe.jk
           WHEN 0 THEN 'Pria'
           WHEN 1 THEN 'Wanita'
           ELSE '-'
         END AS jenis_kelamin_label
       FROM peserta pe
       LEFT JOIN provinsi pr ON pe.provinsi_id = pr.id
       LEFT JOIN kabkot kb ON pe.kabkot_id = kb.id
       ORDER BY pe.id DESC`
    );
    return result.rows;
  },

  // Ambil peserta by ID
  getById: async (id) => {
    const result = await db.query(
      `SELECT
         pe.*,
         pr.nama_provinsi,
         kb.nama_kabkot,
         CASE pe.jk
           WHEN 0 THEN 'Pria'
           WHEN 1 THEN 'Wanita'
           ELSE '-'
         END AS jenis_kelamin_label
       FROM peserta pe
       LEFT JOIN provinsi pr ON pe.provinsi_id = pr.id
       LEFT JOIN kabkot kb ON pe.kabkot_id = kb.id
       WHERE pe.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Buat peserta baru
  create: async (data) => {
    const {
      nama, tempatLahir, tanggalLahir, agama,
      alamat, telepon, jk, foto, provinsi_id, kabkot_id,
    } = data;

    const result = await db.query(
      `INSERT INTO peserta
         (nama, "tempatLahir", "tanggalLahir", agama, alamat, telepon, jk, foto, provinsi_id, kabkot_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW(), NOW())
       RETURNING *`,
      [nama, tempatLahir, tanggalLahir, agama, alamat || null, telepon || null, jk, foto || null, provinsi_id, kabkot_id]
    );
    return result.rows[0];
  },

  // Update peserta
  update: async (id, data) => {
    const {
      nama, tempatLahir, tanggalLahir, agama,
      alamat, telepon, jk, foto, provinsi_id, kabkot_id,
    } = data;

    const result = await db.query(
      `UPDATE peserta SET
         nama=$1, "tempatLahir"=$2, "tanggalLahir"=$3, agama=$4,
         alamat=$5, telepon=$6, jk=$7, foto=$8,
         provinsi_id=$9, kabkot_id=$10, updated_at=NOW()
       WHERE id=$11
       RETURNING *`,
      [nama, tempatLahir, tanggalLahir, agama, alamat || null, telepon || null, jk, foto || null, provinsi_id, kabkot_id, id]
    );
    return result.rows[0];
  },

  // Hapus peserta
  delete: async (id) => {
    const result = await db.query(
      'DELETE FROM peserta WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = PesertaModel;
