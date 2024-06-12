import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);

  const fetchReminders = async () => {
    const userId = await AsyncStorage.getItem('userId');
    fetch(`http://172.16.255.164:3000/reminders?userId=${userId}`)  // Reemplaza 192.168.1.100 con tu IP local
      .then((response) => response.json())
      .then((data) => setReminders(data))
      .catch((error) => {
        console.error("Error fetching reminders:", error);
        alert("Error fetching reminders: " + error.message);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [])
  );

  return (
    <View>
      <Text>Recordatorios de Pago</Text>
      <Button title="Agregar Recordatorio" onPress={() => navigation.navigate('AddReminder')} />
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ReminderDetail', { reminder: item })}>
            <View>
              <Text>{item.name} - {item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
