import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditReminderScreen({ route, navigation }) {
  const { reminder } = route.params;
  const [name, setName] = useState(reminder.name);
  const [date, setDate] = useState(new Date(reminder.date));
  const [total, setTotal] = useState(reminder.total);
  const [details, setDetails] = useState(reminder.details);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
        } else {
          console.error("No userId found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleEditReminder = async () => {
    if (!userId) {
      alert("Error: No userId found. Please restart the app.");
      return;
    }

    const updatedReminder = {
      userId,
      name,
      date: date.toISOString().split('T')[0],
      total,
      details,
    };

    fetch(`http://172.16.255.164:3000/reminders/${reminder.id}`, {  // Reemplaza 192.168.1.100 con tu IP local
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedReminder),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error editing reminder:", error);
        alert("Error editing reminder: " + error.message);
      });
  };

  return (
    <View>
      <Text>Editar Recordatorio</Text>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Total a pagar"
        value={total}
        onChangeText={setTotal}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Detalles"
        value={details}
        onChangeText={setDetails}
      />
      <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
      <Button title="Guardar Cambios" onPress={handleEditReminder} />
    </View>
  );
}
