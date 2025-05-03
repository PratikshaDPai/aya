import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [paletteImage, setPaletteImage] = useState<any>(null);
  const [baseImage, setBaseImage] = useState<any>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [recolorResult, setRecolorResult] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access media library is required!');
        }
      }
    })();
  }, []);

  const extractPalette = async (base64Image: string) => {
    try {
      const response = await fetch('https://a51b-192-195-80-211.ngrok-free.app/recolor', {
        method: 'POST',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, palette: palette, }),
      });
      const json = await response.json();
      setPalette(json.palette);
    } catch (error) {
      console.error('Palette extraction error', error);
    }
  };
  const pickBaseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const picked = result.assets[0];
      setBaseImage(picked);
    }
  };

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

  const handleRecolor = async () => {
    if (!baseImage?.base64 || palette.length === 0) {
      alert('Please pick both a base image and a palette image');
      return;
    }
    try {
      const response = await fetch('https://a51b-192-195-80-211.ngrok-free.app/palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: baseImage.base64,
          palette: palette,
        }),
      });
      const json = await response.json();
      setRecolorResult(json.recolor);
    } catch (error) {
      console.error('Recolor error:', error);
      alert('Failed to recolor image');
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.pickButton} onPress={pickBaseImage}>
        <Text style={styles.pickButtonText}>Pick Base Image</Text>
      </TouchableOpacity>

      {baseImage && (
        <>
          <Image source={{ uri: baseImage.uri }} style={styles.image} />
          <Text style={styles.text}>Base Image loaded </Text>
        </>
      )}
      <TouchableOpacity style={styles.pickButton} onPress={pickPaletteImage}>
        <Text style={styles.pickButtonText}>Pick Palette Image</Text>
      </TouchableOpacity>
      {paletteImage && (
        <>
          <Image source={{ uri: paletteImage.uri }} style={styles.image} />
          <Text style={styles.text}>Palette image loaded </Text>
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
            </View>
          )}
        </>
      )}
      <TouchableOpacity
        style={styles.pickButton}
        onPress={handleRecolor}
        disabled={!baseImage || !palette || palette.length === 0}
      >
        <Text style={styles.pickButtonText}>Recolor Image</Text>
      </TouchableOpacity>

      {recolorResult && (
        <>
          <Text style={styles.sectionTitle}>Recolored Image</Text>
          <Image
            source={{ uri: `data:image/png;base64,${recolorResult}` }}
            style={styles.image}
          />
        </>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
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
  pickButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  pickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

});

