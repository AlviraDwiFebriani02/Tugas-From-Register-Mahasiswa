import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎓 Project Formulir</Text>
        <Text style={styles.subtitle}>Sistem Manajemen Data Peserta</Text>
      </View>

      <Text style={styles.menuLabel}>Menu Utama</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Peserta")}
      >
        <Text style={styles.menuIcon}>👤</Text>
        <View>
          <Text style={styles.menuTitle}>Data Peserta</Text>
          <Text style={styles.menuDesc}>Kelola data peserta terdaftar</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Provinsi")}
      >
        <Text style={styles.menuIcon}>🏛️</Text>
        <View>
          <Text style={styles.menuTitle}>Provinsi</Text>
          <Text style={styles.menuDesc}>Kelola data provinsi</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Kabkot")}
      >
        <Text style={styles.menuIcon}>📍</Text>
        <View>
          <Text style={styles.menuTitle}>Kabupaten/Kota</Text>
          <Text style={styles.menuDesc}>Kelola data kabupaten/kota</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  header: {
    backgroundColor: "#2563eb", padding: 32,
    alignItems: "center", marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#bfdbfe" },
  menuLabel: {
    fontSize: 13, fontWeight: "bold", color: "#64748b",
    paddingHorizontal: 16, marginBottom: 8,
  },
  menuItem: {
    backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 12,
    padding: 16, borderRadius: 12, elevation: 2,
    flexDirection: "row", alignItems: "center",
  },
  menuIcon: { fontSize: 28, marginRight: 14 },
  menuTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  menuDesc: { fontSize: 13, color: "#64748b", marginTop: 2 },
  arrow: { fontSize: 24, color: "#cbd5e1", marginLeft: "auto" },
});