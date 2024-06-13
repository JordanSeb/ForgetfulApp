import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
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

    fetch(`http://172.16.255.164:3000/reminders/${reminder.id}`, {  // Reemplaza 172.16.255.164 con tu IP local
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
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Editar Recordatorio</Title>
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
          <Button onPress={handleEditReminder} mode="contained" style={styles.button}>
            Guardar Cambios
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
