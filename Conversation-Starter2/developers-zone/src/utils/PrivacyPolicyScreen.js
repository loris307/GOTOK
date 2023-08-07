import React from 'react';
import { View, Text, Linking, StyleSheet, ScrollView } from 'react-native';
import PrivacyPolicy from '../assets/advices/privacyPolicy';

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
    <ScrollView>
       <PrivacyPolicy />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 10,
  },
});

export default PrivacyPolicyScreen;