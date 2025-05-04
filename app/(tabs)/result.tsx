import React from 'react';
import Slider from '@react-native-community/slider';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAyaStore } from '../../lib/store';


export default function ResultScreen() {
  const router = useRouter();
  const baseImage = useAyaStore(state => state.baseImage);
  const recolorResult = useAyaStore(state => state.recolorResult);
  const [sliderValue, setSliderValue] = React.useState(0.5); // or 0
  const [wrapperWidth, setWrapperWidth] = React.useState(0);


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
      <Text style={styles.sectionTitle}>Recolored Image</Text>
      <Text style={styles.sectionTitle}>Swipe to Compare</Text>
      <Text style={styles.sectionTitle}>Swipe to Compare</Text>

      <View
        style={styles.imageWrapper}
        onLayout={(e) => setWrapperWidth(e.nativeEvent.layout.width)}
      >
        {/* Base image (always visible) */}
        <Image source={{ uri: baseImage.uri }} style={styles.imageAbsolute} />

        {/* Recolored image clipped from right */}
        <View style={[styles.overlayContainer, { width: sliderValue * wrapperWidth }]}>
          <Image
            source={{ uri: `data:image/png;base64,${recolorResult}` }}
            style={[styles.overlayImage, { width: wrapperWidth, height: '100%' }]}
          />
        </View>

        {/* Vertical slider line */}
        <View style={[styles.sliderLine, { left: sliderValue * wrapperWidth }]} />
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={sliderValue}
        onValueChange={setSliderValue}
        minimumTrackTintColor="#3f51b5"
        maximumTrackTintColor="#ccc"
      />


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
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },

  text: {
    fontSize: 16,
    marginBottom: 12,
  },

  link: {
    color: '#3f51b5',
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  button: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  imageWrapper: {
    width: 300,
    height: 300,
    marginVertical: 20,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#eee',
  },

  imageAbsolute: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
    zIndex: 2, // Makes sure overlay is above base image
  },

  sliderLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#3f51b5',
    zIndex: 10,
  },

  slider: {
    width: 300,
    height: 40,
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  }


});
