'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deletePeserta } from '../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function formatTanggal(tgl) {
  if (!tgl) return '-';
  return new Date(tgl).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function PesertaTable({ data }) {
  const router = useRouter();

  async function handleDelete(id) {
    const ok = window.confirm('Yakin ingin menghapus data peserta ini?');
    if (!ok) return;

    try {
      await deletePeserta(id);
      alert('Data peserta berhasil dihapus');
      router.refresh();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Foto</th>
            <th className="px-4 py-3 text-left">Nama</th>
            <th className="px-4 py-3 text-left">Tempat, Tgl Lahir</th>
            <th className="px-4 py-3 text-left">Agama</th>
            <th className="px-4 py-3 text-left">JK</th>
            <th className="px-4 py-3 text-left">Kabupaten/Kota</th>
            <th className="px-4 py-3 text-left">Provinsi</th>
            <th className="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3">
                {item.foto ? (
                  <img
                    src={`${API_URL}/storage/${item.foto}`}
                    alt={item.nama}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400 text-xs">
                    No Foto
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium">{item.nama}</td>
              <td className="px-4 py-3">
                {item.tempatLahir}, {formatTanggal(item.tanggalLahir)}
              </td>
              <td className="px-4 py-3">{item.agama || '-'}</td>
              <td className="px-4 py-3">{item.jenis_kelamin_label || '-'}</td>
              <td className="px-4 py-3">{item.nama_kabkot || '-'}</td>
              <td className="px-4 py-3">{item.nama_provinsi || '-'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/peserta/edit/${item.id}`}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="9" className="px-4 py-6 text-center text-slate-500">
                Belum ada data peserta.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
