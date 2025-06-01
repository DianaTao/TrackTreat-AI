import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../src/config';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/hooks/useAuth';
import { AnalysisResult, FoodItem } from '../../src/types/analysis';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export default function LogMealScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { user } = useAuth();

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to use this feature.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        setAnalysisResult(null); // Reset previous analysis
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!image || !user) return;

    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;

    try {
      // Compress and encode the image
      const manipResult = await manipulateAsync(
        image,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? manipResult.uri.replace('file://', '') : manipResult.uri,
        type: 'image/jpeg',
        name: 'meal.jpg',
      } as any);
      
      // Add user profile data
      formData.append('profile', JSON.stringify({
        user_id: user.id,
        dietary_restrictions: [],
        health_conditions: [],
      }));

      console.log('Starting API request to:', `${API_URL}/analyze-meal`);
      console.log('Image URI:', manipResult.uri);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      while (retryCount <= maxRetries) {
        try {
          console.log(`Attempt ${retryCount + 1}/${maxRetries + 1} - Sending request...`);
          const startTime = Date.now();

          const response = await fetch(`${API_URL}/analyze-meal`, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          });

          const endTime = Date.now();
          console.log(`Request completed in ${endTime - startTime}ms with status:`, response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          console.log('Parsing response JSON...');
          const data = await response.json();
          console.log('Raw API response:', JSON.stringify(data, null, 2));

          // Ensure data has the expected structure
          const result: AnalysisResult = {
            foodItems: Array.isArray(data.identified_foods) ? data.identified_foods.map((item: any) => ({
              name: item.name || item,
              nutrition: item.nutrition || undefined
            })) : [],
            hasAdvice: Boolean(data.advice),
            hasNutrition: Boolean(data.nutrition),
            processingTime: data.processing_time || 0,
            advice: data.advice || null
          };

          console.log('Processed result:', JSON.stringify(result, null, 2));
          setAnalysisResult(result);
          clearTimeout(timeoutId);
          break;
        } catch (error) {
          lastError = error as Error;
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out after 2 minutes');
          }

          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            retryCount++;
          } else {
            throw lastError;
          }
        }
      }
    } catch (error) {
      console.error('Final error after retries:', error);
      Alert.alert(
        'Analysis Failed',
        'Failed to analyze the image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Log Your Meal</Text>
          <Text style={styles.subtitle}>Take a photo of your meal to get nutritional insights</Text>
        </View>

        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="camera" size={48} color="#0077B6" />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
          
          {image && (
            <TouchableOpacity 
              style={[styles.button, styles.analyzeButton]} 
              onPress={analyzeImage}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Analyze Meal</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {analysisResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Analysis Results</Text>
            
            {analysisResult.foodItems && analysisResult.foodItems.length > 0 ? (
              <View style={styles.foodItemsContainer}>
                {analysisResult.foodItems.map((item: FoodItem, index: number) => (
                  <View key={index} style={styles.foodItem}>
                    <Text style={styles.foodItemName}>{item.name}</Text>
                    {item.nutrition && (
                      <View style={styles.nutritionContainer}>
                        <Text style={styles.nutritionText}>
                          Calories: {item.nutrition.calories || 'N/A'}
                        </Text>
                        <Text style={styles.nutritionText}>
                          Protein: {item.nutrition.protein || 'N/A'}g
                        </Text>
                        <Text style={styles.nutritionText}>
                          Carbs: {item.nutrition.carbs || 'N/A'}g
                        </Text>
                        <Text style={styles.nutritionText}>
                          Fat: {item.nutrition.fat || 'N/A'}g
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noItemsText}>No food items detected</Text>
            )}

            {analysisResult.hasAdvice && analysisResult.advice && (
              <View style={styles.adviceContainer}>
                <Text style={styles.adviceTitle}>Dietary Advice</Text>
                <Text style={styles.adviceText}>
                  {analysisResult.advice}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: '#0077B6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#00B4D8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 16,
  },
  foodItemsContainer: {
    gap: 16,
  },
  foodItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  nutritionContainer: {
    gap: 4,
  },
  nutritionText: {
    fontSize: 14,
    color: '#666666',
  },
  noItemsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  adviceContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077B6',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
});
