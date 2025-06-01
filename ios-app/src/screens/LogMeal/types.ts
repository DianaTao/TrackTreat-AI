import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Dashboard: undefined;
  LogMeal: undefined;
  // Add other screens as needed
};

type LogMealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LogMeal'>;

export interface LogMealScreenProps {
  navigation: LogMealScreenNavigationProp;
}
