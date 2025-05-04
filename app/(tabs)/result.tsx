import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAyaStore } from '../../lib/store';

export default function ResultScreen() {
  const router = useRouter();
  const baseImage = useAyaStore(state => state.baseImage);
  const recolorResult = useAyaStore(state => state.recolorResult);

  if (!recolorResult || !baseImage) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No result to display.</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.link}>← Go to Start</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Original Image</Text>
      <Image source={{ uri: baseImage.uri }} style={styles.image} />

      <Text style={styles.sectionTitle}>Recolored Image</Text>
      <Image source={{ uri: `data:image/png;base64,${recolorResult}` }} style={styles.image} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>🔄 Start Over</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/palette')}>
          <Text style={styles.buttonText}>🔙 Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: 300, height: 300, resizeMode: 'contain', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  text: { fontSize: 16, marginBottom: 12 },
  link: { color: '#3f51b5', fontSize: 16, textDecorationLine: 'underline' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  button: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

