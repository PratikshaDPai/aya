import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAyaStore } from '../../lib/store';

const baseURL = 'https://palette-backend-hqcb.onrender.com'
// local testing url= 'https://a51b-192-195-80-211.ngrok-free.app'

export default function PaletteImageScreen() {
  const router = useRouter();

  const paletteImage = useAyaStore(state => state.paletteImage);
  const setPaletteImage = useAyaStore(state => state.setPaletteImage);
  const palette = useAyaStore(state => state.palette);
  const setPalette = useAyaStore(state => state.setPalette);
  const baseImage = useAyaStore(state => state.baseImage); // for recoloring
  const setRecolorResult = useAyaStore(state => state.setRecolorResult);

  const [loading, setLoading] = React.useState(false);

  const pickPaletteImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const picked = result.assets[0];
      setPaletteImage(picked);
      if (picked.base64) {
        extractPalette(picked.base64);
      } else {
        console.warn('No base64 found on selected image');
      }
    }
  };

  const extractPalette = async (base64Image: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/palette`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const json = await response.json();
      setPalette(json.palette);
    } catch (error) {
      console.error('Palette extraction error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecolor = async () => {
    if (!baseImage?.base64 || palette.length === 0) {
      alert('Please select both images');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/recolor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: baseImage.base64,
          palette: palette,
        }),
      });
      const json = await response.json();
      setRecolorResult(json.recolor);
      router.push('/result');
    } catch (error) {
      console.error('Recolor error:', error);
      alert('Failed to recolor image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.pickButton} onPress={pickPaletteImage}>
        <Text style={styles.pickButtonText}>Pick Palette Image</Text>
      </TouchableOpacity>

      {paletteImage && (
        <>
          <Image source={{ uri: paletteImage.uri }} style={styles.image} />
          <Text style={styles.text}>Palette Image Loaded</Text>
        </>
      )}

      {loading && <ActivityIndicator size="large" color="#3f51b5" style={{ marginVertical: 20 }} />}

      {palette.length > 0 && (
        <View style={styles.paletteCard}>
          <Text style={styles.sectionTitle}>Extracted Palette</Text>
          <View style={styles.swatchContainer}>
            {palette.map((hex, index) => (
              <View key={index} style={styles.swatchBlock}>
                <View style={[styles.swatch, { backgroundColor: hex }]} />
                <Text style={styles.hexText}>{hex}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleRecolor}>
            <Text style={styles.pickButtonText}>Recolor Image</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: 300, height: 300, resizeMode: 'contain', marginVertical: 20 },
  text: { fontSize: 16 },
  pickButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#00c853',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  paletteCard: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  swatchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  swatchBlock: {
    alignItems: 'center',
    margin: 8,
  },
  swatch: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  hexText: {
    marginTop: 6,
    fontSize: 12,
    color: '#ccc',
  },
});

