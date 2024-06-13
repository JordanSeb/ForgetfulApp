import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);

  const fetchReminders = async () => {
    const userId = await AsyncStorage.getItem('userId');
    fetch(`http://172.16.255.164:3000/reminders?userId=${userId}`)  // Reemplaza 172.16.255.164 con tu IP local
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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ReminderDetail', { reminder: item })}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph>{item.date}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Recordatorios de Pago</Title>
      <Button mode="contained" onPress={() => navigation.navigate('AddReminder')} style={styles.button}>
        Agregar Recordatorio
      </Button>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
});
