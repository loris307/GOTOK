import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "developers-zone/firebase.js";



import { useContext } from 'react';
//import { UserContext } from 'developers-zone/src/utils/UserProvider.js';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  //const { setUser } = useContext(UserContext);

  const handlePasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent!');
      Alert.alert('Check your mail!', 'We have sent you a password reset email.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      // Handle specific error messages
      if (error.code === 'auth/missing-email') {
        Alert.alert('Email Not Found', 'You have to put in your email address first.');
      } else if (error.code === 'auth/user-not-found'){
        Alert.alert('User Not Found', 'There is no user corresponding to the email address.');
      }else {
        Alert.alert('Error', 'Email not valid. Please try again.');
      }
    }
    
  };

  const isEmailEntered = email.trim().length > 0;


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in!');
      navigation.navigate('OccasionView');
    } catch (error) {
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

    <View style={styles.container}>
      <View style={{flex:1, justifyContent: 'center', width: '100%'}}>

      
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={130}>
      
        <Text style={styles.title}>Welcome Back</Text>
      
            <View style={styles.inputContainer}>
                <Text style={styles.label} > Email </Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    autoCompleteType="email"
                    onChangeText={setEmail}
                    style={styles.input}
                    
                />

              <Text style={styles.label} > Password </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    style={styles.inputpw}
                  />
                  <TouchableOpacity 
                    style={styles.iconWrap}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                   >
                    <Icon name={isPasswordVisible ? 'eye-slash' : 'eye'} size={20} color='gray'/>
                  </TouchableOpacity>
                </View>
            </View>
      
      
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('SignUpForm')} >
            <Text style={styles.link}>Don't have an account? Click here </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePasswordReset(email)}>
            <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        
      
      </KeyboardAvoidingView>
      </View>

      <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('TermsOfUseTextScreen')}>
              <Text style={styles.footerText}>Terms of use</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>|</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
              <Text style={styles.footerText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>|</Text>
            
            <TouchableOpacity onPress={() => Linking.openURL('https://gotok-ai.com/delete-data/')}>
              <Text style={styles.footerText}>Delete account</Text>
           </TouchableOpacity>

      </View>

    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    //justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignContent: 'center',
    textAlign: 'center',
  },
  label:{ //small label above input
    fontSize: 11,
    color: 'gray',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 30,
    marginTop:10,
  },

  button: {
    backgroundColor: '#B623A3',
    padding: 10,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    //textDecorationLine: 'underline',
    //color: 'blue',
  },
  link2: {
    marginTop: 50,
    textAlign: 'center',
    //textDecorationLine: 'underline',
    //color: 'blue',
  },
  footer: { //should be in the middle of the screen
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 11,
    color: 'black',
    marginHorizontal: 10,
    
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 20,
    paddingRight: 10, // Add padding to the right to create space for the icon
  },
  
  inputpw: {
    flex: 1,
    padding: 10,
  },
  
  iconWrap: {
    position: 'absolute', 
    right: 0,
    paddingRight: 10,
  },
});

export default LoginScreen;