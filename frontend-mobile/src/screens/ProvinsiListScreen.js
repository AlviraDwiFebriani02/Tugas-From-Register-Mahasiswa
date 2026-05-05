import React, { useCallback, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../api/api";

export default function ProvinsiListScreen({ navigation }) {
  const [provinsi, setProvinsi] = useState([]);

  const getProvinsi = async () => {
    try {
      const response = await api.get("/provinsi");
      setProvinsi(response.data.data);
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil data provinsi");
    }
  };

  useFocusEffect(useCallback(() => { getProvinsi(); }, []));

  const hapusProvinsi = async (id) => {
    Alert.alert("Konfirmasi", "Yakin ingin menghapus provinsi ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          try {
            await api.delete(`/provinsi/${id}`);
            Alert.alert("Sukses", "Provinsi berhasil dihapus");
            getProvinsi();
          } catch (error) {
            Alert.alert("Error", "Gagal menghapus provinsi");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.id}>#{item.id}</Text>
        <Text style={styles.nama}>{item.nama_provinsi}</Text>
      </View>
      <View style={styles.action}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("ProvinsiForm", { id: item.id })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => hapusProvinsi(item.id)}
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
        onPress={() => navigation.navigate("ProvinsiForm")}
      >
        <Text style={styles.addButtonText}>+ Tambah Provinsi</Text>
      </TouchableOpacity>
      <FlatList
        data={provinsi}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Belum ada data provinsi</Text>}
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
  nama: { fontSize: 16, fontWeight: "bold", flex: 1 },
  action: { flexDirection: "row" },
  editButton: { backgroundColor: "#f59e0b", padding: 10, borderRadius: 6, marginRight: 8 },
  deleteButton: { backgroundColor: "#dc2626", padding: 10, borderRadius: 6 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 20 },
});