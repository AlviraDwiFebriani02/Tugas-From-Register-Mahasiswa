import KabkotForm from '../../../components/KabkotForm';

export default function TambahKabkotPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Tambah Kabupaten/Kota</h2>
        <p className="text-sm text-slate-600">
          Isi formulir untuk menambahkan data kabupaten/kota baru.
        </p>
      </div>
      <KabkotForm />
    </section>
  );
}
