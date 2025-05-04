import React from 'react';
import Slider from '@react-native-community/slider';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAyaStore } from '../../lib/store';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function ResultScreen() {
  const router = useRouter();
  const baseImage = useAyaStore(state => state.baseImage);
  const recolorResult = useAyaStore(state => state.recolorResult);
  const [sliderValue, setSliderValue] = React.useState(0.5);
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
      <Text style={styles.title}>AYA</Text>
      <Text style={styles.subtext}>Swipe to Compare</Text>

      <View
        style={styles.imageWrapper}
        onLayout={(e) => setWrapperWidth(e.nativeEvent.layout.width)}
      >
        {/* Base image */}
        <Image source={{ uri: baseImage.uri }} style={styles.imageAbsolute} />

        {/* Overlayed recolored image */}
        <View style={[styles.overlayContainer, { width: sliderValue * wrapperWidth }]}>
          <Image
            source={{ uri: `data:image/png;base64,${recolorResult}` }}
            style={[styles.overlayImage, { width: wrapperWidth, height: '100%' }]}
          />
        </View>

        {/* Vertical slider indicator */}
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
        <TouchableOpacity style={styles.controlButton} onPress={() => router.replace('/palette')}>
          <LinearGradient
            colors={['#0648a4', '#5337a5']}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.gradientButton}
          >
            <MaterialIcons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.buttonText}>Back </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={() => router.replace('/')}>
          <LinearGradient
            colors={['#ff416c', '#7f00ff']}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.gradientButton}
          >
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>Start Over</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtext: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 12,
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
    zIndex: 2,
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    gap: 12,
  },
  controlButton: {
    flex: 1,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 32,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  link: {
    color: '#7f00ff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
