const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { cache: 'no-store', ...options });
  const result = await res.json();
  if (!res.ok) {
    const msg = result.errors
      ? result.errors.join(', ')
      : result.message || 'Terjadi kesalahan';
    throw new Error(msg);
  }
  return result.data;
}

// ─── Provinsi ─────────────────────────────────────────────────────────────────

export async function getProvinsi() {
  return fetchJSON(`${API_URL}/provinsi`);
}

export async function getProvinsiById(id) {
  return fetchJSON(`${API_URL}/provinsi/${id}`);
}

export async function createProvinsi(nama_provinsi) {
  return fetchJSON(`${API_URL}/provinsi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama_provinsi }),
  });
}

export async function updateProvinsi(id, nama_provinsi) {
  return fetchJSON(`${API_URL}/provinsi/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama_provinsi }),
  });
}

export async function deleteProvinsi(id) {
  const res = await fetch(`${API_URL}/provinsi/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || 'Gagal menghapus provinsi');
  }
  return res.json();
}

// ─── Kabupaten/Kota ───────────────────────────────────────────────────────────

export async function getKabkot() {
  return fetchJSON(`${API_URL}/kabkot`);
}

export async function getKabkotById(id) {
  return fetchJSON(`${API_URL}/kabkot/${id}`);
}

export async function getKabkotByProvinsi(provinsi_id) {
  return fetchJSON(`${API_URL}/kabkot/by-provinsi?provinsi_id=${provinsi_id}`);
}

export async function createKabkot(data) {
  return fetchJSON(`${API_URL}/kabkot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateKabkot(id, data) {
  return fetchJSON(`${API_URL}/kabkot/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteKabkot(id) {
  const res = await fetch(`${API_URL}/kabkot/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || 'Gagal menghapus kabkot');
  }
  return res.json();
}

// ─── Peserta ──────────────────────────────────────────────────────────────────

export async function getPeserta() {
  return fetchJSON(`${API_URL}/peserta`);
}

export async function getPesertaById(id) {
  return fetchJSON(`${API_URL}/peserta/${id}`);
}

/**
 * createPeserta - mengirim FormData karena ada upload foto
 */
export async function createPeserta(formData) {
  const res = await fetch(`${API_URL}/peserta`, {
    method: 'POST',
    cache: 'no-store',
    body: formData, // FormData, jangan set Content-Type manual
  });
  const result = await res.json();
  if (!res.ok) {
    const msg = result.errors
      ? result.errors.join(', ')
      : result.message || 'Gagal menambah peserta';
    throw new Error(msg);
  }
  return result.data;
}

/**
 * updatePeserta - mengirim FormData karena ada upload foto
 */
export async function updatePeserta(id, formData) {
  const res = await fetch(`${API_URL}/peserta/${id}`, {
    method: 'PUT',
    cache: 'no-store',
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) {
    const msg = result.errors
      ? result.errors.join(', ')
      : result.message || 'Gagal memperbarui peserta';
    throw new Error(msg);
  }
  return result.data;
}

export async function deletePeserta(id) {
  const res = await fetch(`${API_URL}/peserta/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || 'Gagal menghapus peserta');
  }
  return res.json();
}
