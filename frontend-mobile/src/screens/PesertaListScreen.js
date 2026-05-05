import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../api/api";

export default function PesertaListScreen({ navigation }) {
  const [peserta, setPeserta] = useState([]);

  const getPeserta = async () => {
  try {
    const response = await api.get("/peserta");

    console.log(response.data); // cek response backend

    setPeserta(response.data.data); 
  } catch (error) {
    Alert.alert("Error", "Gagal mengambil data peserta");
    console.log(error);
  }
};

  useFocusEffect(
    useCallback(() => {
      getPeserta();
    }, [])
  );

  const hapusPeserta = async (id) => {
  // FIX: gunakan window.confirm untuk web, Alert untuk HP
  const konfirmasi = typeof window !== "undefined" && window.confirm
    ? window.confirm("Yakin ingin menghapus data ini?")
    : true; // di HP langsung lanjut ke Alert.alert di bawah

  if (typeof window !== "undefined" && window.confirm) {
    // Mode web (laptop)
    if (!konfirmasi) return;
    try {
      await api.delete(`/peserta/${id}`);
      alert("Data berhasil dihapus");
      getPeserta();
    } catch (error) {
      alert("Gagal menghapus data");
      console.log(error.message);
    }
  } else {
    // Mode HP
    Alert.alert("Konfirmasi", "Yakin ingin menghapus data ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          try {
            await api.delete(`/peserta/${id}`);
            Alert.alert("Sukses", "Data berhasil dihapus");
            getPeserta();
          } catch (error) {
            Alert.alert("Error", "Gagal menghapus data");
            console.log(error.message);
          }
        },
      },
    ]);
  }
};
  const renderItem = ({ item }) => (
  <View style={styles.card}>
    <TouchableOpacity
      onPress={() => navigation.navigate("PesertaDetail", { id: item.id })}
    >
      <Text style={styles.nama}>{item.nama}</Text>
      <Text>Tempat Lahir: {item.tempatLahir}</Text>
      <Text>Tanggal Lahir: {item.tanggalLahir ? new Date(item.tanggalLahir).toLocaleDateString("id-ID") : "-"}</Text>
      <Text>Telepon: {item.telepon}</Text>
      <Text>Agama: {item.agama || "-"}</Text>
      <Text>Jenis Kelamin: {item.jenis_kelamin_label || "-"}</Text>
      <Text>Provinsi: {item.nama_provinsi || "-"}</Text>
      <Text>Kabupaten/Kota: {item.nama_kabkot || "-"}</Text>
    </TouchableOpacity>

    <View style={styles.action}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("PesertaForm", { id: item.id })}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => hapusPeserta(item.id)}
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
        onPress={() => navigation.navigate("PesertaForm")}
      >
        <Text style={styles.addButtonText}>+ Tambah Peserta</Text>
      </TouchableOpacity>

      <FlatList
        data={peserta}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada data peserta</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
  },
  nama: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  action: {
    flexDirection: "row",
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#f59e0b",
    padding: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});