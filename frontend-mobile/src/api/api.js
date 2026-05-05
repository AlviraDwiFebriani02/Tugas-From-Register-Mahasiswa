import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.137.145:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// ── Provinsi ──────────────────────────────
export const getProvinsi = () => api.get("/provinsi");

// ── Kabkot ────────────────────────────────
export const getKabkoByProvinsi = (provinsiId) =>
  api.get(`/kabkot/by-provinsi?provinsi_id=${provinsiId}`);