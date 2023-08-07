import React, { useState } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import TermsOfUseText from 'developers-zone/src/assets/termsOfUse.js';

import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "developers-zone/firebase.js";


import i18n from 'developers-zone/i18n.js';

const TermsOfUseScreen = ({ navigation, route }) => {
  const [isSelected, setSelection] = useState(false);
  const { name, email, password, age, gender, language } = route.params;
  const [errorMessage, setErrorMessage] = useState(null);


  const handleSignUp = async () => {
    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      
      // Store the additional user information in Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        age,
        gender,
        language,
        apiCallCount: 0, // initialize apiCallCount to 0
        lastApiCall: new Date(), // initialize lastApiCall to the current date
      });

       // Send email verification
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  
      i18n.locale = language;


      console.log('User account created & signed !');
      navigation.navigate('OccasionView'); // Navigate to the next screen after successful registration
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle specific error messages
      if (error.code === 'auth/weak-password') {
        setErrorMessage('Your password is not strong enough.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already in use.');
      }else if (error.code === 'auth/invalid-email') {
        setErrorMessage('This email is invalid.');
      }
       else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  }

  const termsOfUseText = `Your long terms of use text goes here...`;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TermsOfUseText/>
      </ScrollView>

      <View style={styles.checkBoxContainer}>
        <View style={styles.checkBoxWrapper}>
          <CheckBox
            style={styles.checkBox}
            title='I agree to the terms of use'
            checked={isSelected}
            onPress={() => setSelection(!isSelected)}
          />
        </View>
      </View>

      {isSelected && 

        <TouchableOpacity onPress={handleSignUp}  style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      }

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  scrollView: {
    marginVertical: 20,
  },
  checkBoxContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  checkBoxWrapper: {
    width: "100%",
    paddingHorizontal: 10,
  },
  checkBox: {
    marginRight: 8,
  },

  button: {
    backgroundColor: '#B623A3',
    padding: 10,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 0,
    marginBottom: 20,
  },
});

export default TermsOfUseScreen;