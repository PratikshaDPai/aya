import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAyaStore } from '../../lib/store';

export default function BaseImageScreen() {
  const router = useRouter();

  const baseImage = useAyaStore(state => state.baseImage);
  const setBaseImage = useAyaStore(state => state.setBaseImage);

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access media library is required!');
        }
      }
    })();
  }, []);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.pickButton} onPress={pickBaseImage}>
        <Text style={styles.pickButtonText}>Pick Base Image</Text>
      </TouchableOpacity>

      {baseImage && (
        <>
          <Image source={{ uri: baseImage.uri }} style={styles.image} />
          <Text style={styles.text}>Base Image Loaded</Text>
          <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/palette')}>
            <Text style={styles.pickButtonText}>Next: Pick Palette Image</Text>
          </TouchableOpacity>
        </>
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
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#00c853',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
  },
});
