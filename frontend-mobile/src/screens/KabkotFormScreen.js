import React, { useEffect, useState } from "react";
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet,
  Alert, ScrollView, Modal, FlatList,
} from "react-native";
import api, { getProvinsi } from "../api/api";

function Dropdown({ label, value, onSelect, options, placeholder }) {
  const [visible, setVisible] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: selected ? "#000" : "#999", fontSize: 14 }}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={{ color: "#999" }}>▾</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, item.value === value && styles.modalItemActive]}
                  onPress={() => { onSelect(item.value); setVisible(false); }}
                >
                  <Text style={{ fontSize: 14, color: item.value === value ? "#2563eb" : "#333", fontWeight: item.value === value ? "bold" : "normal" }}>
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

export default function KabkotFormScreen({ route, navigation }) {
  const id = route.params?.id;
  const [namaKabkot, setNamaKabkot] = useState("");
  const [provinsiId, setProvinsiId] = useState(null);
  const [provinsiList, setProvinsiList] = useState([]);

  useEffect(() => {
    loadProvinsi();
    if (id) getKabkotById();
  }, [id]);

  const loadProvinsi = async () => {
    try {
      const res = await getProvinsi();
      setProvinsiList(res.data.data.map((p) => ({ value: p.id, label: p.nama_provinsi })));
    } catch (error) {
      Alert.alert("Error", "Gagal memuat data provinsi");
    }
  };

  const getKabkotById = async () => {
    try {
      const response = await api.get(`/kabkot/${id}`);
      const d = response.data.data ?? response.data;
      setNamaKabkot(d.nama_kabkot || "");
      setProvinsiId(d.provinsi_id || null);
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil data kabupaten/kota");
    }
  };

  const simpanKabkot = async () => {
    if (!namaKabkot.trim()) {
      Alert.alert("Validasi", "Nama kabupaten/kota wajib diisi");
      return;
    }
    if (!provinsiId) {
      Alert.alert("Validasi", "Provinsi wajib dipilih");
      return;
    }
    try {
      const payload = { nama_kabkot: namaKabkot, provinsi_id: Number(provinsiId) };
      if (id) {
        await api.put(`/kabkot/${id}`, payload);
        Alert.alert("Sukses", "Kabupaten/Kota berhasil diperbarui");
      } else {
        await api.post("/kabkot", payload);
        Alert.alert("Sukses", "Kabupaten/Kota berhasil ditambahkan");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan kabupaten/kota");
      console.log(error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nama Kabupaten/Kota</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Kabupaten Sidoarjo"
        value={namaKabkot}
        onChangeText={setNamaKabkot}
      />
      <Dropdown
        label="Provinsi"
        value={provinsiId}
        onSelect={setProvinsiId}
        options={provinsiList}
        placeholder="-- Pilih Provinsi --"
      />
      <TouchableOpacity style={[styles.saveButton, { marginTop: 20 }]} onPress={simpanKabkot}>
        <Text style={styles.saveButtonText}>
          {id ? "Update Kabupaten/Kota" : "Simpan Kabupaten/Kota"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: "bold", marginBottom: 6, color: "#333" },
  input: {
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd",
    padding: 12, borderRadius: 8, marginBottom: 12,
  },
  saveButton: { backgroundColor: "#16a34a", padding: 14, borderRadius: 8, marginBottom: 30 },
  saveButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", borderRadius: 12, padding: 8, width: "85%", maxHeight: "60%" },
  modalTitle: { fontSize: 15, fontWeight: "bold", color: "#2563eb", padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  modalItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#f5f5f5" },
  modalItemActive: { backgroundColor: "#eff6ff" },
});