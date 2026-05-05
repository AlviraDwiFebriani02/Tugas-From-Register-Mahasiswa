import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import api, { getProvinsi, getKabkoByProvinsi } from "../api/api";

const AGAMA_OPTIONS = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];

// ── Komponen Dropdown ─────────────────────
function Dropdown({ label, value, onSelect, options, placeholder, disabled }) {
  const [visible, setVisible] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.input,
          styles.dropdownBox,
          disabled && styles.dropdownDisabled,
        ]}
        onPress={() => !disabled && setVisible(true)}
      >
        <Text style={{ color: selected ? "#000" : "#999", fontSize: 14 }}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={{ color: "#999" }}>▾</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item.value === value && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: item.value === value ? "#2563eb" : "#333",
                      fontWeight: item.value === value ? "bold" : "normal",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ── Main Screen ───────────────────────────
export default function PesertaFormScreen({ route, navigation }) {
  const id = route.params?.id;

  const [form, setForm] = useState({
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    agama: "",
    alamat: "",
    telepon: "",
    jk: "",
    provinsi_id: null,
    kabkot_id: null,
  });

  const [provinsiList, setProvinsiList] = useState([]);
  const [kabkoList, setKabkoList] = useState([]);
  const [loadingKabko, setLoadingKabko] = useState(false);

  const pendingKabkotId = useRef(null);
  const isFirstKabkotLoad = useRef(true);

  useEffect(() => {
    if (id) getPesertaById();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProvinsi();
        setProvinsiList(
          res.data.data.map((p) => ({
            value: p.id,
            label: p.nama_provinsi,
          }))
        );
      } catch (error) {
        Alert.alert("Error", "Gagal memuat data provinsi");
        console.log(error.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!form.provinsi_id) {
      setKabkoList([]);
      return;
    }

    setLoadingKabko(true);

    if (!isFirstKabkotLoad.current) {
      setForm((prev) => ({ ...prev, kabkot_id: null }));
    }

    (async () => {
      try {
        const res = await getKabkoByProvinsi(form.provinsi_id);
        const list = res.data.data.map((k) => ({
          value: k.id,
          label: k.nama_kabkot,
        }));
        setKabkoList(list);

       // FIX: restore kabkot_id setelah list loaded (mode edit)
if (isFirstKabkotLoad.current && pendingKabkotId.current) {
  const targetId = pendingKabkotId.current;
  console.log("RESTORE KABKOT:", targetId); // ← LOG
  console.log("LIST:", list.map(k => k.value)); // ← LOG
  setForm((prev) => ({ ...prev, kabkot_id: targetId }));
  pendingKabkotId.current = null;
}

        isFirstKabkotLoad.current = false;
      } catch (error) {
        Alert.alert("Error", "Gagal memuat data kabupaten/kota");
        console.log(error.message);
      } finally {
        setLoadingKabko(false);
      }
    })();
  }, [form.provinsi_id]);

  const getPesertaById = async () => {
  try {
    const response = await api.get(`/peserta/${id}`);
    const d = response.data.data ?? response.data;

    console.log("JK VALUE:", d.jk, "TYPE:", typeof d.jk);

    pendingKabkotId.current = d.kabkot_id || null;

    setForm({
      nama: d.nama || "",
      tempatLahir: d.tempatLahir || "",
      tanggalLahir: d.tanggalLahir ? d.tanggalLahir.substring(0, 10) : "",
      agama: d.agama || "",
      alamat: d.alamat || "",
      telepon: d.telepon || "",
      jk: d.jenis_kelamin_label === "Pria" ? "Pria" 
  : d.jenis_kelamin_label === "Wanita" ? "Wanita" 
  : "",  // ← pakai jenis_kelamin_label bukan jk
      provinsi_id: d.provinsi_id || null,
      kabkot_id: null, // ← set null dulu, restore setelah kabko list loaded
    });
  } catch (error) {
    Alert.alert("Error", "Gagal mengambil detail peserta");
    console.log(error.message);
  }
};

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const simpanPeserta = async () => {
    if (!form.nama || !form.tempatLahir || !form.tanggalLahir) {
      Alert.alert("Validasi", "Nama, tempat lahir, dan tanggal lahir wajib diisi");
      return;
    }
    if (!form.agama) {
      Alert.alert("Validasi", "Agama wajib dipilih");
      return;
    }
    if (!form.provinsi_id) {
      Alert.alert("Validasi", "Provinsi wajib dipilih");
      return;
    }
    if (!form.kabkot_id) {
      Alert.alert("Validasi", "Kabupaten/Kota wajib dipilih");
      return;
    }

    // Sesuaikan nama field dengan yang backend expect
    const payload = {
      nama: form.nama,
      tempat: form.tempatLahir,
      tanggal: form.tanggalLahir,
      agama: form.agama,
      alamat: form.alamat,
      notelp: form.telepon,
      jk: form.jk,
      provinsi_id: Number(form.provinsi_id),
      kabkot_id: Number(form.kabkot_id),
    };

    console.log("PAYLOAD:", JSON.stringify(payload));

    try {
      if (id) {
        await api.put(`/peserta/${id}`, payload);
        Alert.alert("Sukses", "Data berhasil diperbarui");
      } else {
        await api.post("/peserta", payload);
        Alert.alert("Sukses", "Data berhasil ditambahkan");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan data peserta");
      console.log("ERROR:", error.message);
      console.log("ERROR DETAIL:", error.response?.data);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={form.nama}
        onChangeText={(v) => handleChange("nama", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tempat Lahir"
        value={form.tempatLahir}
        onChangeText={(v) => handleChange("tempatLahir", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tanggal Lahir, contoh: 2001-12-25"
        value={form.tanggalLahir}
        onChangeText={(v) => handleChange("tanggalLahir", v)}
      />

      {/* Dropdown Agama */}
      <Dropdown
        label="Agama"
        value={form.agama}
        onSelect={(v) => handleChange("agama", v)}
        options={AGAMA_OPTIONS.map((a) => ({ value: a, label: a }))}
        placeholder="-- Pilih Agama --"
      />

      <View style={{ marginTop: 12 }}>
        <TextInput
          style={styles.input}
          placeholder="Alamat"
          value={form.alamat}
          onChangeText={(v) => handleChange("alamat", v)}
          multiline
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Telepon"
        value={form.telepon}
        onChangeText={(v) => handleChange("telepon", v)}
        keyboardType="phone-pad"
      />

      {/* Dropdown Jenis Kelamin */}
      <Dropdown
  label="Jenis Kelamin"
  value={form.jk}
  onSelect={(v) => handleChange("jk", v)}
  options={[
    { value: "Pria", label: "Pria" },    // ← ubah value
    { value: "Wanita", label: "Wanita" }, // ← ubah value
  ]}
  placeholder="-- Pilih Jenis Kelamin --"
/>

      {/* Dropdown Provinsi */}
      <View style={{ marginTop: 12 }}>
        <Dropdown
          label="Provinsi"
          value={form.provinsi_id}
          onSelect={(v) => {
            isFirstKabkotLoad.current = false;
            setForm((prev) => ({ ...prev, provinsi_id: v, kabkot_id: null }));
          }}
          options={provinsiList}
          placeholder="-- Pilih Provinsi --"
        />
      </View>

      {/* Dropdown Kabkot */}
      <View style={{ marginTop: 12 }}>
        {loadingKabko ? (
          <Text style={{ color: "#999", marginBottom: 12 }}>
            Memuat kabupaten/kota...
          </Text>
        ) : (
          <Dropdown
            label="Kabupaten / Kota"
            value={form.kabkot_id}
            onSelect={(v) => handleChange("kabkot_id", v)}
            options={kabkoList}
            placeholder={
              form.provinsi_id
                ? "-- Pilih Kabupaten/Kota --"
                : "-- Pilih provinsi dulu --"
            }
            disabled={!form.provinsi_id}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { marginTop: 20 }]}
        onPress={simpanPeserta}
      >
        <Text style={styles.saveButtonText}>
          {id ? "Update Peserta" : "Simpan Peserta"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 30,
  },
  saveButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  dropdownLabel: { fontWeight: "bold", marginBottom: 4, color: "#333" },
  dropdownBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownDisabled: { backgroundColor: "#f5f5f5" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    width: "85%",
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563eb",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  modalItemActive: { backgroundColor: "#eff6ff" },
});