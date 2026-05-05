import React, { useEffect, useState } from "react";
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView,
} from "react-native";
import api from "../api/api";

export default function ProvinsiFormScreen({ route, navigation }) {
  const id = route.params?.id;
  const [namaProvinsi, setNamaProvinsi] = useState("");

  useEffect(() => {
    if (id) getProvinsiById();
  }, [id]);

  const getProvinsiById = async () => {
    try {
      const response = await api.get(`/provinsi/${id}`);
      const d = response.data.data ?? response.data;
      setNamaProvinsi(d.nama_provinsi || "");
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil data provinsi");
    }
  };

  const simpanProvinsi = async () => {
    if (!namaProvinsi.trim()) {
      Alert.alert("Validasi", "Nama provinsi wajib diisi");
      return;
    }
    try {
      if (id) {
        await api.put(`/provinsi/${id}`, { nama_provinsi: namaProvinsi });
        Alert.alert("Sukses", "Provinsi berhasil diperbarui");
      } else {
        await api.post("/provinsi", { nama_provinsi: namaProvinsi });
        Alert.alert("Sukses", "Provinsi berhasil ditambahkan");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan provinsi");
      console.log(error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nama Provinsi</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Jawa Timur"
        value={namaProvinsi}
        onChangeText={setNamaProvinsi}
      />
      <TouchableOpacity style={styles.saveButton} onPress={simpanProvinsi}>
        <Text style={styles.saveButtonText}>
          {id ? "Update Provinsi" : "Simpan Provinsi"}
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
    padding: 12, borderRadius: 8, marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#16a34a", padding: 14, borderRadius: 8, marginTop: 8,
  },
  saveButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});