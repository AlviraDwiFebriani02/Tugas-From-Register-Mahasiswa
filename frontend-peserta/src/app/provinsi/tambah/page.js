import ProvinsiForm from '../../../components/ProvinsiForm';

export default function TambahProvinsiPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Tambah Provinsi</h2>
        <p className="text-sm text-slate-600">
          Isi formulir untuk menambahkan data provinsi baru.
        </p>
      </div>
      <ProvinsiForm />
    </section>
  );
}
