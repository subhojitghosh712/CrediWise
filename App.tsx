import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

// Import all screens
import WelcomeScreen from './screens/WelcomeScreen';
import LearnScreen from './screens/LearnScreen';
import SimulatorScreen from './screens/SimulatorScreen';
import QuizScreen from './screens/QuizScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import CompoundScreen from './screens/CompoundScreen';
import BudgetTracker from './screens/BudgetTracker';
import LoanTracker from './screens/LoanTracker';

// Import navigation type
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="welcomescreen"
          screenOptions={{
            headerStyle: { backgroundColor: '#1a73e8' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackButtonDisplayMode: "minimal"
          }}
        >
          {/* Welcome screen */}
          <Stack.Screen
            name="welcomescreen"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />

          {/* All main screens stacked */}
          <Stack.Screen
            name="learn"
            component={LearnScreen}
            options={{
              title: 'Learn',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="simulator"
            component={SimulatorScreen}
            options={{
              title: 'Simulator',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="quiz"
            component={QuizScreen}
            options={{
              title: 'Quiz',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="compoundscreen"
            component={CompoundScreen}
            options={{
              title: 'Compound Interest',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="budgettracker"
            component={BudgetTracker}
            options={{
              title: 'Budgeting',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="loantracker"
            component={LoanTracker}
            options={{
              title: 'Loan & EMI Tracker',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="chatbot"
            component={ChatbotScreen}
            options={{
              title: 'AI Financial Advisor',
              headerBackTitleVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
