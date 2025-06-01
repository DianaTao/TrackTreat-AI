import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../utils/supabase';

const DashboardScreen = () => {
  const [userData, setUserData] = useState({
    dailySummary: {
      calories: 1850,
      calorieGoal: 2200,
      protein: 85,
      proteinGoal: 120,
      carbs: 220,
      carbsGoal: 250,
      fat: 65,
      fatGoal: 70,
    },
    gamification: {
      level: 5,
      xp: 450,
      xpToNextLevel: 1000,
      streakDays: 7,
      badges: [
        { id: "1", name: "7-Day Streak", description: "Logged meals for 7 consecutive days" },
        { id: "2", name: "Protein Champion", description: "Hit protein goals 5 days in a row" },
      ],
    },
    recentMeals: [
      { id: "1", name: "Breakfast", time: "8:30 AM", calories: 450 },
      { id: "2", name: "Lunch", time: "12:15 PM", calories: 680 },
      { id: "3", name: "Snack", time: "3:45 PM", calories: 220 },
    ],
  });
  
  const [loading, setLoading] = useState(false);

  // Mock function to fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would fetch data from Supabase
      const { data: user } = await supabase.auth.getUser();
      
      if (user) {
        // For now, we'll just use our mock data
        // In production, we would fetch this from our API
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Progress bar component
  const ProgressBar = ({ current, goal, color = '#22c55e' }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    
    return (
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
    );
  };

  // Badge component
  const Badge = ({ name, description }) => {
    return (
      <View style={styles.badgeContainer}>
        <View style={styles.badgeIconContainer}>
          <Ionicons name="star" size={24} color="#22c55e" />
        </View>
        <Text style={styles.badgeName}>{name}</Text>
        <Text style={styles.badgeDescription}>{description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Daily Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Summary</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Calories</Text>
              <Text style={styles.cardSubtitle}>
                {userData.dailySummary.calories} / {userData.dailySummary.calorieGoal} kcal
              </Text>
            </View>
            <ProgressBar 
              current={userData.dailySummary.calories} 
              goal={userData.dailySummary.calorieGoal} 
            />
          </View>
          
          {/* Macronutrients */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Macronutrients</Text>
            </View>
            
            <View style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>Protein</Text>
                <Text style={styles.macroValue}>
                  {userData.dailySummary.protein}g / {userData.dailySummary.proteinGoal}g
                </Text>
              </View>
              <ProgressBar 
                current={userData.dailySummary.protein} 
                goal={userData.dailySummary.proteinGoal} 
                color="#3b82f6"
              />
            </View>
            
            <View style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>Carbs</Text>
                <Text style={styles.macroValue}>
                  {userData.dailySummary.carbs}g / {userData.dailySummary.carbsGoal}g
                </Text>
              </View>
              <ProgressBar 
                current={userData.dailySummary.carbs} 
                goal={userData.dailySummary.carbsGoal} 
                color="#f59e0b"
              />
            </View>
            
            <View style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>Fat</Text>
                <Text style={styles.macroValue}>
                  {userData.dailySummary.fat}g / {userData.dailySummary.fatGoal}g
                </Text>
              </View>
              <ProgressBar 
                current={userData.dailySummary.fat} 
                goal={userData.dailySummary.fatGoal} 
                color="#ef4444"
              />
            </View>
          </View>
        </View>
        
        {/* Gamification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Level {userData.gamification.level}</Text>
              <Text style={styles.cardSubtitle}>
                {userData.gamification.xp} / {userData.gamification.xpToNextLevel} XP
              </Text>
            </View>
            <ProgressBar 
              current={userData.gamification.xp} 
              goal={userData.gamification.xpToNextLevel} 
              color="#8b5cf6"
            />
            <View style={styles.streakContainer}>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>{userData.gamification.streakDays}</Text>
              </View>
              <Text style={styles.streakLabel}>Day streak</Text>
            </View>
          </View>
        </View>
        
        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Badges</Text>
          <View style={styles.badgesGrid}>
            {userData.gamification.badges.map((badge) => (
              <Badge 
                key={badge.id} 
                name={badge.name} 
                description={badge.description} 
              />
            ))}
          </View>
        </View>
        
        {/* Recent Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          <View style={styles.card}>
            {userData.recentMeals.map((meal, index) => (
              <View key={meal.id}>
                {index > 0 && <View style={styles.mealDivider} />}
                <View style={styles.mealItem}>
                  <View>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </View>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  macroItem: {
    marginBottom: 12,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  macroName: {
    fontSize: 14,
  },
  macroValue: {
    fontSize: 14,
    color: '#666',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  streakBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  streakText: {
    color: '#fff',
    fontWeight: '600',
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeContainer: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f7ef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  mealDivider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 12,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 15,
    fontWeight: '500',
  },
  mealTime: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  mealCalories: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default DashboardScreen;
