import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';

const UpdateRequiredScreen = () => {
  const storeURL = Platform.OS === 'ios' 
        ? 'https://apps.apple.com/'
        : 'https://play.google.com/store/apps';

  const handleUpdate = () => {
    Linking.canOpenURL(storeURL).then(supported => {
      if (supported) {
        Linking.openURL(storeURL);
      } else {
        console.log("Don't know how to open URI: " + storeURL);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Required</Text>
      <Text style={styles.description}>Please update the app to continue.</Text>
      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Update Now</Text>
      </TouchableOpacity>
    </View>
  );
}

export default UpdateRequiredScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 40,
  },
  btn: {
    backgroundColor: '#B623A3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
});
