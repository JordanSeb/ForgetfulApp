// ReminderDetailScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReminderDetailScreen({ route, navigation }) {
  const { reminder } = route.params;

  const handleDeleteReminder = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`https://backendforgetful.onrender.com/reminders/${reminder.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error('Error deleting reminder');
      }
      console.log("Reminder deleted successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      alert("Error deleting reminder: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Detalles del Recordatorio</Title>
          <Paragraph>Nombre: {reminder.name}</Paragraph>
          <Paragraph>Fecha: {reminder.date}</Paragraph>
          <Paragraph>Total: {reminder.total}</Paragraph>
          <Paragraph>Detalles: {reminder.details}</Paragraph>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditReminder', { reminder })}
            style={styles.button}
          >
            Editar
          </Button>
          <Button
            mode="contained"
            onPress={handleDeleteReminder}
            style={[styles.button, styles.deleteButton]}
          >
            Eliminar
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
  button: {
    marginTop: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});
