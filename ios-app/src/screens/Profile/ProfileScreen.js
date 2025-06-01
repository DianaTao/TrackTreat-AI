import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase, signOut } from '../../utils/supabase';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingMeasurements, setSavingMeasurements] = useState(false);
  const [savingTargets, setSavingTargets] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dob: '1990-01-01',
    gender: 'male',
    height: '175',
    weight: '70',
    activityLevel: 'moderate',
    goal: 'maintain',
    targets: {
      calories: '2200',
      protein: '120',
      carbs: '250',
      fat: '70',
      fiber: '30',
      sugar: '50',
      sodium: '2300',
      water: '2500',
    }
  });

  // Fetch user profile data
  const fetchProfile = async () => {
    setLoading(true);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (user) {
        // In a production app, you would fetch the profile data from Supabase
        // For demo purposes, we'll just use the mock data
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating profile sections
  const updatePersonalInfo = async () => {
    setSavingPersonal(true);
    
    try {
      // In a production app, you would update the profile data in Supabase
      setTimeout(() => {
        setSavingPersonal(false);
        Alert.alert('Success', 'Personal information updated');
      }, 1000);
    } catch (error) {
      console.error('Error updating personal info:', error);
      Alert.alert('Error', 'Failed to update personal information');
      setSavingPersonal(false);
    }
  };
  
  const updateMeasurements = async () => {
    setSavingMeasurements(true);
    
    try {
      // In a production app, you would update the measurements in Supabase
      setTimeout(() => {
        setSavingMeasurements(false);
        Alert.alert('Success', 'Body measurements updated');
      }, 1000);
    } catch (error) {
      console.error('Error updating measurements:', error);
      Alert.alert('Error', 'Failed to update body measurements');
      setSavingMeasurements(false);
    }
  };
  
  const updateNutritionTargets = async () => {
    setSavingTargets(true);
    
    try {
      // In a production app, you would update the nutrition targets in Supabase
      setTimeout(() => {
        setSavingTargets(false);
        Alert.alert('Success', 'Nutrition targets updated');
      }, 1000);
    } catch (error) {
      console.error('Error updating nutrition targets:', error);
      Alert.alert('Error', 'Failed to update nutrition targets');
      setSavingTargets(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Image picker handlers
  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access camera is required!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 8 }}>
            <TouchableOpacity style={styles.avatarButton} onPress={takePhoto}>
              <Ionicons name="camera" size={20} color="#0077B6" />
              <Text style={styles.avatarButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarButton} onPress={pickImageFromLibrary}>
              <Ionicons name="image" size={20} color="#0077B6" />
              <Text style={styles.avatarButtonText}>Choose</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
        
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.formRow}>
            <View style={styles.formItem}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={profile.firstName}
                onChangeText={(text) => setProfile({...profile, firstName: text})}
                placeholder="First Name"
              />
            </View>
            <View style={styles.formItem}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={profile.lastName}
                onChangeText={(text) => setProfile({...profile, lastName: text})}
                placeholder="Last Name"
              />
            </View>
          </View>
          
          <View style={styles.formItem}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={profile.email}
              editable={false}
            />
            <Text style={styles.helperText}>Your email address cannot be changed</Text>
          </View>
          
          <View style={styles.formItem}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={profile.dob}
              onChangeText={(text) => setProfile({...profile, dob: text})}
              placeholder="YYYY-MM-DD"
            />
          </View>
          
          <View style={styles.formItem}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <TextInput
                style={styles.input}
                value={profile.gender === 'male' ? 'Male' : 
                       profile.gender === 'female' ? 'Female' : 
                       profile.gender === 'non-binary' ? 'Non-binary' : 'Prefer not to say'}
                editable={false}
              />
              <Ionicons name="chevron-down" size={20} color="#888" style={styles.pickerIcon} />
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={updatePersonalInfo}
            disabled={savingPersonal}
          >
            {savingPersonal ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Save Personal Information</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Body Measurements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Measurements</Text>
          
          <View style={styles.formItem}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={profile.height}
              onChangeText={(text) => setProfile({...profile, height: text})}
              placeholder="Height in cm"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formItem}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={profile.weight}
              onChangeText={(text) => setProfile({...profile, weight: text})}
              placeholder="Weight in kg"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formItem}>
            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.pickerContainer}>
              <TextInput
                style={styles.input}
                value={profile.activityLevel === 'sedentary' ? 'Sedentary' : 
                       profile.activityLevel === 'light' ? 'Lightly active' : 
                       profile.activityLevel === 'moderate' ? 'Moderately active' : 
                       profile.activityLevel === 'active' ? 'Active' : 'Very active'}
                editable={false}
              />
              <Ionicons name="chevron-down" size={20} color="#888" style={styles.pickerIcon} />
            </View>
          </View>
          
          <View style={styles.formItem}>
            <Text style={styles.label}>Fitness Goal</Text>
            <View style={styles.pickerContainer}>
              <TextInput
                style={styles.input}
                value={profile.goal === 'lose-weight' ? 'Lose Weight' : 
                       profile.goal === 'maintain' ? 'Maintain Weight' : 
                       profile.goal === 'gain-weight' ? 'Gain Weight' : 'Build Muscle'}
                editable={false}
              />
              <Ionicons name="chevron-down" size={20} color="#888" style={styles.pickerIcon} />
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={updateMeasurements}
            disabled={savingMeasurements}
          >
            {savingMeasurements ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Save Measurements</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Nutrition Targets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Targets</Text>
          <Text style={styles.sectionSubtitle}>
            Customize your daily nutrition targets or use automatically calculated values
          </Text>
          
          <View style={styles.formGrid}>
            <View style={styles.formGridItem}>
              <Text style={styles.label}>Calories (kcal)</Text>
              <TextInput
                style={styles.input}
                value={profile.targets.calories}
                onChangeText={(text) => setProfile({
                  ...profile, 
                  targets: {...profile.targets, calories: text}
                })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGridItem}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                value={profile.targets.protein}
                onChangeText={(text) => setProfile({
                  ...profile, 
                  targets: {...profile.targets, protein: text}
                })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGridItem}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={profile.targets.carbs}
                onChangeText={(text) => setProfile({
                  ...profile, 
                  targets: {...profile.targets, carbs: text}
                })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGridItem}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                value={profile.targets.fat}
                onChangeText={(text) => setProfile({
                  ...profile, 
                  targets: {...profile.targets, fat: text}
                })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGridItem}>
              <Text style={styles.label}>Fiber (g)</Text>
              <TextInput
                style={styles.input}
                value={profile.targets.fiber}
                onChangeText={(text) => setProfile({
                  ...profile, 
                  targets: {...profile.targets, fiber: text}
                })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGridItem}>
              <Text style={styles.label}>Sugar (g)</Text>
              <TextInput
                style={styles.input}
                value={profile.targets.sugar}
                onChangeText={(text) => setProfile({
                  ...profile, 
                  targets: {...profile.targets, sugar: text}
                })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGridItem}>
              <Text style={styles.label}>Sodium (mg)</Text>
              <TextInput
                style={styles.input}
                value={profile.targets.sodium}
                onChangeText={(text) => setProfile({
                  ...profile, 
                  targets: {...profile.targets, sodium: text}
                })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGridItem}>
              <Text style={styles.label}>Water (ml)</Text>
              <TextInput
                style={styles.input}
                value={profile.targets.water}
                onChangeText={(text) => setProfile({
                  ...profile, 
                  targets: {...profile.targets, water: text}
                })}
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.outlineButton]}>
              <Text style={styles.outlineButtonText}>Reset to Recommended</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={updateNutritionTargets}
              disabled={savingTargets}
            >
              {savingTargets ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Save Targets</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#f43f5e" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: 'cover',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginHorizontal: 2,
  },
  avatarButtonText: {
    color: '#0077B6',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formItem: {
    marginBottom: 16,
    flex: 1,
  },
  formItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  pickerContainer: {
    position: 'relative',
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  formGridItem: {
    width: '48%',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#22c55e',
    flex: 1,
    marginRight: 8,
  },
  outlineButtonText: {
    color: '#22c55e',
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButton: {
    flex: 1,
    marginLeft: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 8,
    marginBottom: 30,
  },
  signOutText: {
    color: '#f43f5e',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProfileScreen;
