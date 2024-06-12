import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReminderDetailScreen({ route, navigation }) {
  const { reminder } = route.params;

  const handleDeleteReminder = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      alert("Error: No userId found. Please restart the app.");
      return;
    }

    fetch(`http://172.16.255.164:3000/reminders/${reminder.id}`, {  // Reemplaza 192.168.1.100 con tu IP local
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error deleting reminder:", error);
        alert("Error deleting reminder: " + error.message);
      });
  };

  return (
    <View>
      <Text>Nombre: {reminder.name}</Text>
      <Text>Fecha: {reminder.date}</Text>
      <Text>Total: {reminder.total}</Text>
      <Text>Detalles: {reminder.details}</Text>
      <Button
        title="Editar"
        onPress={() => navigation.navigate('EditReminder', { reminder })}
      />
      <Button
        title="Eliminar"
        onPress={handleDeleteReminder}
        color="red"
      />
    </View>
  );
}
