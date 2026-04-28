'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteProvinsi } from '../lib/api';

export default function ProvinsiTable({ data }) {
  const router = useRouter();

  async function handleDelete(id) {
    const ok = window.confirm('Yakin ingin menghapus provinsi ini?');
    if (!ok) return;

    try {
      await deleteProvinsi(id);
      alert('Provinsi berhasil dihapus');
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
            <th className="px-4 py-3 text-left">Nama Provinsi</th>
            <th className="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3 font-medium">{item.nama_provinsi}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/provinsi/edit/${item.id}`}
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
              <td colSpan="3" className="px-4 py-6 text-center text-slate-500">
                Belum ada data provinsi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
