// AddReminderScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddReminderScreen({ navigation }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [total, setTotal] = useState('');
  const [details, setDetails] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddReminder = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const reminder = {
        userId,
        name,
        date: date.toISOString().split('T')[0],
        total,
        details,
      };
      const response = await fetch('https://backendforgetful.onrender.com/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminder),
      });
      if (!response.ok) {
        throw new Error('Error adding reminder');
      }
      const data = await response.json();
      console.log("Response from server:", data);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding reminder:", error);
      alert("Error adding reminder: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Agregar Recordatorio</Title>
          <TextInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Total a pagar"
            value={total}
            onChangeText={setTotal}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Detalles"
            value={details}
            onChangeText={setDetails}
            style={styles.input}
          />
          <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={styles.button}>
            Seleccionar Fecha
          </Button>
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
          <Button onPress={handleAddReminder} mode="contained" style={styles.button}>
            Agregar Recordatorio
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
