import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReminderDetailScreen({ route, navigation }) {
  const { reminder } = route.params;

  const handleDeleteReminder = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      alert("Error: No userId found. Please restart the app.");
      return;
    }

    fetch(`http://172.16.255.164:3000/reminders/${reminder.id}`, {  // Reemplaza 172.16.255.164 con tu IP local
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
