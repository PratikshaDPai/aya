import React, { useState, useEffect } from 'react';
import { View, Button, Image, Platform, StyleSheet, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [image, setImage] = useState<any>(null);
  const [palette, setPalette] = useState<string[]>([]);

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
      const response = await fetch('http://127.0.0.1:5000/palette', {
        method: 'POST',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const json = await response.json();
      setPalette(json.palette);
    } catch (error) {
      console.error('Palette extraction error', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const picked = result.assets[0]; 
      setImage(picked);
      if (picked.base64) {
        extractPalette(picked.base64);
      } else {
        console.warn('No base64 found on selected image');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && (
        <>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <Text style={styles.text}>Image loaded ✅</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: 300, height: 300, resizeMode: 'contain', marginVertical: 20 },
  text: { fontSize: 16 },
});
