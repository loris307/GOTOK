import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';


const LoginSignUp = ({ navigation }) => {
    return (
        <View style={styles.container}>
          <Image source={require('developers-zone/src/assets/LogoStartScreen.png')} style={styles.logo} />
          <Text style={styles.catchPhrase}>GoTok</Text>
          <View style={styles.buttonsContainer}>

            <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('LoginScreen')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={ () => navigation.navigate('SignUpForm')} >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('TermsOfUseTextScreen')}>
              <Text style={styles.footerText}>Terms of use</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>|</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
              <Text style={styles.footerText}>Privacy Policy</Text>
            </TouchableOpacity>

          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#B623A3',
      },
      logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        resizeMode: 'contain',
      },
      catchPhrase: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#FFFFFF',
      },
      buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
      },
      button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
      },
      loginButton: {
        backgroundColor: '#FFFFFF',
      },
      loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
      signUpButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
      },
      signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
      buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
      },
      footer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
      },
      footerText: {
        fontSize: 11,
        color: 'white',
        marginHorizontal: 10,
      },
    });
    
export default LoginSignUp;
    
    
    
    
    
    
    
