import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

function MapScreen(props) {
  const [location, setLocation] = useState(null);
  

  const handleMapPress = (event) => {
    setLocation(event.nativeEvent.coordinate);
  };

  const handleSavePress = () => {
    props.onLocationSelect(location);
    props.onselect(false);
    console.log(location);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} onPress={handleMapPress}>
        {location && <Marker coordinate={location} />}
      </MapView>
      <TouchableOpacity style={styles.button} onPress={handleSavePress}>
        <Text style={styles.buttonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MapScreen;