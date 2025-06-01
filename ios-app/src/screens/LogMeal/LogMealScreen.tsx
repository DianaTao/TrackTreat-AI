import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Platform,
  Linking,
  Dimensions
} from 'react-native'; 
import { Camera, CameraType, FlashMode, CameraView } from 'expo-camera';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { analyzeMeal, logMeal } from '../../services/mealService';
import type { LogMealScreenProps } from './types';

type AudioRecording = {
  stopAndUnloadAsync: () => Promise<void>;
  getURI: () => string | null;
};

type NutritionInfo = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
};

type IdentifiedFood = {
  confidence: number;
  name: string;
  portion_size: string;
  weight_grams: number;
};

type MealAnalysisResult = {
  advice?: string;
  identified_foods?: IdentifiedFood[];
  nutrition?: NutritionInfo;
  processing_time?: number;
  transcript?: string | null;
};

type MealData = {
  id?: string;
  userId: string;
  mealName: string;
  timestamp: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  foodItems?: string[];
  notes: string;
  logged_at?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

type Styles = {
  container: ViewStyle;
  scrollView: ViewStyle;
  title: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  input: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  photoPreview: ImageStyle;
  cameraContainer: ViewStyle;
  camera: ViewStyle;
  buttonContainer: ViewStyle;
  captureButton: ViewStyle;
  captureButtonInner: ViewStyle;
  photoButton: ViewStyle;
  photoButtonText: TextStyle;
  removeButton: ViewStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  disabledInput: ViewStyle;
  detectedItems: ViewStyle;
  detectedItemsTitle: TextStyle;
  adviceContainer: ViewStyle;
  adviceText: TextStyle;
  nutritionInfo: ViewStyle;
};

const { width } = Dimensions.get('window');

const LogMealScreen: React.FC<LogMealScreenProps> = ({ navigation }) => {
  // Refs
  const cameraRef = useRef(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  
  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [mealName, setMealName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<MealAnalysisResult | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  
  const [mealData, setMealData] = useState<MealData>({
    userId: 'current-user-id', // Replace with actual user ID
    mealName: '',
    timestamp: new Date().toISOString(),
    notes: '',
    imageUrl: null,
    audioUrl: null,
    foodItems: [],
  });

  // Request camera and audio permissions
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');
      
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      setHasAudioPermission(audioStatus === 'granted');
    })();
  }, []);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      durationInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000) as unknown as NodeJS.Timeout;
    } else if (durationInterval.current) {
      clearInterval(durationInterval.current as unknown as number);
    }
    
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current as unknown as number);
      }
    };
  }, [isRecording]);

  // Analyze the captured image
  const analyzeImage = async (base64Image: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await analyzeMeal(base64Image);
      setAnalysisResult(result);
      
      // Auto-fill meal name if we detect food items
      if (result.identified_foods && result.identified_foods.length > 0 && !mealName.trim()) {
        setMealName(result.identified_foods.slice(0, 3).map((food: IdentifiedFood) => food.name).join(', '));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image';
      setError(errorMessage);
      console.error('Error analyzing image:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle camera type between front and back
  const toggleCameraType = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  // Open device settings
  const openSettings = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  };

  // Toggle flash mode
  const toggleFlash = () => {
    setFlashMode(prev =>
      prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off'
    );
  };

  // Take a picture with the camera
  const takePicture = async () => {
    // CameraView does not support takePictureAsync directly. You need to use onPhotoCaptured or similar, or use expo-image-picker for this functionality.
    Alert.alert('Not implemented', 'Taking a picture is not implemented for CameraView. Use expo-image-picker or implement onPhotoCaptured.');
  };

  // Start recording audio
  const startRecording = async () => {
    if (hasAudioPermission === false) {
      setError('Audio permission not granted');
      return;
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      setError(null);
      durationInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000) as unknown as NodeJS.Timeout;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      console.error('Error starting recording:', err);
    }
  };

  // Stop recording audio
  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      if (durationInterval.current) {
        clearInterval(durationInterval.current as unknown as number);
      }
      setRecording(null);
      setIsRecording(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
      setError(errorMessage);
      console.error('Error stopping recording:', err);
    }
  };

  // Format recording duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pick an image from the library
  const pickImage = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.base64) {
        const base64Image = `data:image/jpg;base64,${result.assets[0].base64}`;
        setCapturedImage(result.assets[0].uri);
        
        // Call analyzeMeal with the base64 image
        const analysis = await analyzeMeal(base64Image);
        setAnalysisResult(analysis);
        
        // Update meal data with analysis results
        setMealData(prev => ({
          ...prev,
          imageUrl: result.assets[0].uri,
          mealName: analysis.food_items?.[0] || 'Meal',
          nutrition: {
            calories: analysis.calories || 0,
            protein: analysis.protein || 0,
            carbs: analysis.carbs || 0,
            fat: analysis.fat || 0,
          },
          foodItems: analysis.food_items || [],
          calories: analysis.calories,
          protein: analysis.protein,
          carbs: analysis.carbs,
          fat: analysis.fat,
            }));
            
            setMealName(analysis.food_items?.[0] || 'Meal');
          }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    } finally {
      setIsLoading(false);
    }
  };

  // Log the meal
  const handleLogMeal = async () => {
    try {
      setIsLoading(true);
      const updatedMealData = {
        ...mealData,
        mealName: mealName,
        notes: notes,
        logged_at: new Date().toISOString(),
      };
      await logMeal(updatedMealData);
      // @ts-ignore
      navigation.navigate('Home', { refresh: true });
      Alert.alert('Success', 'Meal logged successfully!');
    } catch (error) {
      console.error('Error logging meal:', error);
      Alert.alert('Error', 'Failed to log meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Camera view component
  const CameraViewComponent = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        facing={cameraType}
        flash={flashMode}
        style={styles.camera}
      />
      <View style={styles.cameraOverlay}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraType}
        >
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}
          disabled={isLoading}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flashButton}
          onPress={toggleFlash}
        >
          <Ionicons name="flash" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.photoOptions}>
        <TouchableOpacity style={[styles.photoButton, styles.photoButtonHalf]} onPress={pickImage}>
          <Ionicons name="image" size={20} color="#4a90e2" />
          <Text style={styles.photoOptionText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Preview component
  const PreviewComponent = () => (
    <View style={styles.previewContainer}>
      <Image
        source={capturedImage ? { uri: capturedImage } : undefined}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.retakeButton}
        onPress={() => setCapturedImage(null)}
        disabled={isLoading}
      >
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.retakeButtonText}>Retake</Text>
      </TouchableOpacity>
    </View>
  );

  // Form component
  const FormComponent = () => (
    <ScrollView style={styles.formContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meal Information</Text>
        <TextInput
          style={[styles.input, isLoading && styles.disabledInput]}
          placeholder="Meal name"
          value={mealName}
          onChangeText={setMealName}
          editable={!isLoading}
        />
        <TextInput
          style={[
            styles.input,
            isLoading && styles.disabledInput,
            { height: 100, textAlignVertical: 'top' },
          ]}
          placeholder="Add notes about your meal..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          editable={!isLoading}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Notes</Text>
        <View style={styles.recordingContainer}>
          {isRecording && recording ? (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRecording}
            >
              <Text style={styles.buttonText}>Stop Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={startRecording}
              disabled={isLoading}
              style={styles.recordButton}
            >
              <Ionicons name="mic" size={24} color="white" />
              <Text style={styles.recordButtonText}>
                {isRecording ? 'Recording...' : 'Record Audio Note'}
              </Text>
            </TouchableOpacity>
          )}
          {recordingDuration > 0 && (
            <Text style={styles.recordingTime}>
              {formatDuration(recordingDuration)}
            </Text>
          )}
        </View>
      </View>

      {analysisResult && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analysis Results</Text>
          <View style={styles.nutritionInfo}>
            <Text>Calories: {analysisResult.nutrition?.calories || 'N/A'}</Text>
            <Text>Protein: {analysisResult.nutrition?.protein || 'N/A'}g</Text>
            <Text>Carbs: {analysisResult.nutrition?.carbs || 'N/A'}g</Text>
            <Text>Fat: {analysisResult.nutrition?.fat || 'N/A'}g</Text>
          </View>
          {analysisResult.identified_foods?.length && analysisResult.identified_foods.length > 0 ? (
            <View style={styles.detectedItems}>
              <Text style={styles.detectedItemsTitle}>Detected Items:</Text>
              {analysisResult.identified_foods.map((food, index) => (
                <Text key={index}>
                  • {food.name} ({food.portion_size}, {food.weight_grams}g) - {Math.round(food.confidence * 100)}%
                </Text>
              ))}
            </View>
          ) : (
            <Text>No food items detected in the image.</Text>
          )}
          {analysisResult.advice && (
            <View style={styles.adviceContainer}>
              <Text style={styles.adviceText}>{analysisResult.advice}</Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (isLoading || !capturedImage) && styles.disabledButton,
        ]}
        onPress={handleLogMeal}
        disabled={isLoading || !capturedImage}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#4a90e2" />
        ) : (
          <Text style={styles.submitButtonText}>Log Meal</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollView: {
      flex: 1,
    },
    cameraContainer: {
      height: 300,
      borderRadius: 15,
      overflow: 'hidden',
      marginBottom: 20,
    },
    camera: {
      flex: 1,
    },
    cameraOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    cameraControls: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#ff6b6b',
    },
    flipButton: {
      padding: 15,
    },
    flashButton: {
      padding: 15,
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      padding: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
    },
    previewImage: {
      width: '100%',
      height: '100%',
    },
    formContainer: {
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      fontSize: 16,
    },
    submitButton: {
      backgroundColor: '#4CAF50',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
    },
    permissionDeniedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    permissionDeniedText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    settingsButton: {
      backgroundColor: '#4CAF50',
      padding: 15,
      borderRadius: 10,
    },
    settingsButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    photoOptions: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    photoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      marginHorizontal: 8,
    },
    photoButtonHalf: {
      width: '48%',
    },
    photoOptionText: {
      marginLeft: 8,
      color: '#4a90e2',
      fontWeight: '500',
    },
    previewContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    retakeButton: {
      position: 'absolute',
      bottom: 20,
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: 15,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
    },
    retakeButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 8,
    },
    recordingContainer: {
      width: '100%',
      height: 120,
      borderRadius: 12,
      backgroundColor: '#fff',
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    stopButton: {
      backgroundColor: '#e53935',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    recordButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#22c55e',
      justifyContent: 'center',
      alignItems: 'center',
    },
    recordButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginTop: 8,
    },
    recordingTime: {
      fontSize: 14,
      fontWeight: '500',
      marginTop: 8,
    },
    disabledButton: {
      backgroundColor: '#a5d6a7',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
    },
    disabledInput: {
      opacity: 0.5,
    },
    detectedItems: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
    detectedItemsTitle: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    adviceContainer: {
      marginTop: 15,
      padding: 10,
      backgroundColor: '#e8f5e9',
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#4caf50',
    },
    adviceText: {
      fontStyle: 'italic',
      color: '#2e7d32',
    },
    nutritionInfo: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f0f7ff',
      borderRadius: 8,
      marginBottom: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {hasCameraPermission === false ? (
        <View style={styles.permissionDeniedContainer}>
          <Text style={styles.permissionDeniedText}>
            Camera permission is required to take photos of your meals.
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={openSettings}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      ) : !capturedImage ? (
        <CameraViewComponent />
      ) : (
        <>
          <PreviewComponent />
          <FormComponent />
        </>
    )}
  </SafeAreaView>
  );
};

export default LogMealScreen;
