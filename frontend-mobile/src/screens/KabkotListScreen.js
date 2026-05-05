import React, { useCallback, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../api/api";

export default function KabkotListScreen({ navigation }) {
  const [kabkot, setKabkot] = useState([]);

  const getKabkot = async () => {
    try {
      const response = await api.get("/kabkot");
      setKabkot(response.data.data);
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil data kabupaten/kota");
    }
  };

  useFocusEffect(useCallback(() => { getKabkot(); }, []));

  const hapusKabkot = async (id) => {
    Alert.alert("Konfirmasi", "Yakin ingin menghapus kabupaten/kota ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          try {
            await api.delete(`/kabkot/${id}`);
            Alert.alert("Sukses", "Kabupaten/Kota berhasil dihapus");
            getKabkot();
          } catch (error) {
            Alert.alert("Error", "Gagal menghapus kabupaten/kota");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.id}>#{item.id}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.nama}>{item.nama_kabkot}</Text>
          <Text style={styles.provinsi}>{item.nama_provinsi}</Text>
        </View>
      </View>
      <View style={styles.action}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("KabkotForm", { id: item.id })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => hapusKabkot(item.id)}
        >
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("KabkotForm")}
      >
        <Text style={styles.addButtonText}>+ Tambah Kabupaten/Kota</Text>
      </TouchableOpacity>
      <FlatList
        data={kabkot}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Belum ada data kabupaten/kota</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addButton: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  card: { backgroundColor: "#fff", padding: 14, borderRadius: 8, marginBottom: 12, elevation: 3 },
  cardContent: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  id: { fontSize: 12, color: "#999", marginRight: 8 },
  nama: { fontSize: 16, fontWeight: "bold" },
  provinsi: { fontSize: 13, color: "#666", marginTop: 2 },
  action: { flexDirection: "row" },
  editButton: { backgroundColor: "#f59e0b", padding: 10, borderRadius: 6, marginRight: 8 },
  deleteButton: { backgroundColor: "#dc2626", padding: 10, borderRadius: 6 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 20 },
});