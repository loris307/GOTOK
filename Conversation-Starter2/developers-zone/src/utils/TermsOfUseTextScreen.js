import React from 'react';
import { View, Text, Linking, StyleSheet, ScrollView } from 'react-native';
import TermsOfUseText from 'developers-zone/src/assets/termsOfUse.js';

const TermsOfUseTextScreen = () => {
  return (
    <View style={styles.container}>
    <ScrollView>
       <TermsOfUseText />
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

export default TermsOfUseTextScreen;