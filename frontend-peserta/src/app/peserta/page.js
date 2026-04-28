import Link from 'next/link';
import { getPeserta } from '../../lib/api';
import PesertaTable from '../../components/PesertaTable';

export default async function PesertaPage() {
  const data = await getPeserta();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Daftar Peserta</h2>
          <p className="text-sm text-slate-600">
            Data peserta beserta kabupaten/kota dan provinsi.
          </p>
        </div>
        <Link
          href="/peserta/tambah"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Tambah Peserta
        </Link>
      </div>

      <PesertaTable data={data || []} />
    </section>
  );
}
