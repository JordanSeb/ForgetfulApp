import 'react-native-get-random-values'; // Importar antes de usar uuid
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import HomeScreen from './screens/HomeScreen';
import AddReminderScreen from './screens/AddReminderScreen';
import EditReminderScreen from './screens/EditReminderScreen';
import ReminderDetailScreen from './screens/ReminderDetailScreen';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const initializeUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          const newUserId = uuidv4();
          await AsyncStorage.setItem('userId', newUserId);
          console.log("New userId created:", newUserId);
        } else {
          console.log("Existing userId:", userId);
        }
      } catch (error) {
        console.error("Error initializing userId:", error);
      }
    };

    initializeUserId();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddReminder" component={AddReminderScreen} />
          <Stack.Screen name="EditReminder" component={EditReminderScreen} />
          <Stack.Screen name="ReminderDetail" component={ReminderDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
