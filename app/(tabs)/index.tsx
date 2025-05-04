import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAyaStore } from '../../lib/store';

export default function BaseImageScreen() {
  const router = useRouter();
  const baseImage = useAyaStore(state => state.baseImage);
  const setBaseImage = useAyaStore(state => state.setBaseImage);

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
    <View style={styles.container}>
      <Text style={styles.title}>AYA</Text>

      <TouchableOpacity style={styles.circleButton} onPress={pickBaseImage}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>

      <Text style={styles.subtext}>Pick a base image</Text>

      {baseImage && (
        <Image source={{ uri: baseImage.uri }} style={styles.preview} resizeMode="contain" />
      )}

      {baseImage && (
        <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => router.push('/palette')}>
          <LinearGradient
            colors={['#ff416c', '#7f00ff']}
            style={styles.nextButton}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={styles.nextText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  circleButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  plus: {
    fontSize: 40,
    color: '#777',
  },
  subtext: {
    color: '#777',
    fontSize: 16,
    marginBottom: 20,
  },
  preview: {
    width: 240,
    height: 240,
    borderRadius: 12,
    marginBottom: 20,
  },
  nextButtonWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
