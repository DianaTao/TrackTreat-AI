import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
  // Current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // State for selected day and meals
  const [selectedDay, setSelectedDay] = useState(today);
  
  // Mock data - Dates with meals (would come from API in real app)
  const markedDates = {
    [today]: { marked: true, dotColor: '#22c55e' },
    '2025-05-26': { marked: true, dotColor: '#22c55e' },
    '2025-05-25': { marked: true, dotColor: '#22c55e' },
    '2025-05-23': { marked: true, dotColor: '#22c55e' },
    '2025-05-20': { marked: true, dotColor: '#22c55e' },
  };
  
  // Add selection marking to the selected day
  const markedDatesWithSelection = {
    ...markedDates,
    [selectedDay]: {
      ...markedDates[selectedDay],
      selected: true,
      selectedColor: '#22c55e',
    },
  };
  
  // Mock meal data for the selected day
  const mockMeals = {
    '2025-05-27': [
      {
        id: "1",
        name: "Breakfast",
        time: "8:30 AM",
        items: ["Oatmeal with berries", "Greek yogurt", "Coffee"],
        calories: 450,
        nutrition: { protein: 22, carbs: 65, fat: 12, fiber: 8 },
      },
      {
        id: "2",
        name: "Lunch",
        time: "12:15 PM",
        items: ["Grilled chicken salad", "Quinoa", "Avocado"],
        calories: 680,
        nutrition: { protein: 45, carbs: 55, fat: 25, fiber: 12 },
      },
      {
        id: "3",
        name: "Snack",
        time: "3:45 PM",
        items: ["Apple", "Almonds"],
        calories: 220,
        nutrition: { protein: 6, carbs: 25, fat: 12, fiber: 5 },
      },
      {
        id: "4",
        name: "Dinner",
        time: "7:00 PM",
        items: ["Salmon", "Roasted vegetables", "Brown rice"],
        calories: 750,
        nutrition: { protein: 40, carbs: 65, fat: 30, fiber: 10 },
      },
    ],
    '2025-05-26': [
      {
        id: "1",
        name: "Breakfast",
        time: "8:00 AM",
        items: ["Avocado toast", "Eggs", "Orange juice"],
        calories: 520,
        nutrition: { protein: 25, carbs: 45, fat: 28, fiber: 7 },
      },
      {
        id: "2",
        name: "Lunch",
        time: "1:00 PM",
        items: ["Turkey sandwich", "Apple", "Yogurt"],
        calories: 550,
        nutrition: { protein: 35, carbs: 65, fat: 18, fiber: 8 },
      },
      {
        id: "3",
        name: "Dinner",
        time: "6:30 PM",
        items: ["Pasta with tomato sauce", "Garlic bread", "Salad"],
        calories: 820,
        nutrition: { protein: 25, carbs: 120, fat: 22, fiber: 12 },
      },
    ],
  };
  
  const meals = mockMeals[selectedDay] || [];
  
  // Calculate total nutrition for the day
  const totalNutrition = meals.reduce(
    (acc, meal) => {
      return {
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.nutrition.protein,
        carbs: acc.carbs + meal.nutrition.carbs,
        fat: acc.fat + meal.nutrition.fat,
        fiber: acc.fiber + meal.nutrition.fiber,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDatesWithSelection}
            onDayPress={(day) => setSelectedDay(day.dateString)}
            monthFormat={'MMMM yyyy'}
            hideExtraDays={true}
            firstDay={1}
            enableSwipeMonths={true}
            theme={{
              todayTextColor: '#22c55e',
              arrowColor: '#22c55e',
              dotColor: '#22c55e',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500',
            }}
          />
        </View>
        
        <View style={styles.selectedDayContainer}>
          <Text style={styles.selectedDayText}>{formatDate(selectedDay)}</Text>
        </View>
        
        {meals.length > 0 ? (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Daily Summary</Text>
            
            <View style={styles.nutritionSummary}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{totalNutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{totalNutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{totalNutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{totalNutrition.fat}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
            
            <Text style={styles.mealsTitle}>Meals</Text>
            
            <View style={styles.mealsList}>
              {meals.map((meal) => (
                <View key={meal.id} style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <View>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                    <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                  </View>
                  
                  <Text style={styles.mealItems}>{meal.items.join(", ")}</Text>
                  
                  <View style={styles.macroContainer}>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{meal.nutrition.protein}g</Text>
                      <Text style={styles.macroLabel}>Protein</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{meal.nutrition.carbs}g</Text>
                      <Text style={styles.macroLabel}>Carbs</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{meal.nutrition.fat}g</Text>
                      <Text style={styles.macroLabel}>Fat</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{meal.nutrition.fiber}g</Text>
                      <Text style={styles.macroLabel}>Fiber</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.noMealsContainer}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.noMealsText}>No meals logged for this day</Text>
            <TouchableOpacity style={styles.logMealButton}>
              <Text style={styles.logMealButtonText}>Log a Meal</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDayContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  selectedDayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingHorizontal: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mealsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  mealsList: {
    marginBottom: 20,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealItems: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  macroLabel: {
    fontSize: 10,
    color: '#666',
  },
  noMealsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  noMealsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  logMealButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logMealButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CalendarScreen;
