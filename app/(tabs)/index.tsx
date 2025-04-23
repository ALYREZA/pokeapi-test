import { Stack } from 'expo-router';
import { StyleSheet, View, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';

const data = [
  {
    name: "Tom",
    favColor: "royalblue",
    id: 1
  },
  {
    name: "Sarah",
    favColor: "palevioletred",
    id: 2
  },
  {
    name: "Paul",
    favColor: "seagreen",
    id: 3
  },
  {
    name: "John",
    favColor: "royalblue",
    id: 4
  },
  {
    name: "Ashley",
    favColor: "orange",
    id: 5
  }
];

export default function Home() {
  const [selectedColor, setSelectedColor] = useState('all');

  // Filter data based on selected color
  const filteredData = selectedColor === 'all' 
    ? data 
    : data.filter(item => item.favColor === selectedColor);

  return (
    <>
      <Stack.Screen options={{ title: 'Test One' }} />
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedColor}
            style={{ height: 50, width: 150 }}
            onValueChange={itemValue => setSelectedColor(itemValue)}
          >
            <Picker.Item label="Royalblue" value="royalblue" />
            <Picker.Item label="Palevioletred" value="palevioletred" />
            <Picker.Item label="Seagreen" value="seagreen" />
            <Picker.Item label="Orange" value="orange" />
            <Picker.Item label="All" value="all" />
          </Picker>
        </View>
        
        <View style={styles.cardsContainer}>
          {filteredData.map(item => (
            <View 
              key={item.id} 
              style={[styles.card, { backgroundColor: item.favColor }]}
            >
              <Text style={styles.cardText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
