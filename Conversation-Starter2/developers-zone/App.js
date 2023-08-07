
import React, { useState, useEffect } from 'react';
import { View} from 'react-native';
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from './src/assets/styles';
import './firebase.js';
import { auth } from './firebase.js';
import { getFirestore, doc, getDoc } from "firebase/firestore";





import { useAuthentication } from './src/Components /UserAuth/useAuthentication';


import { LogBox } from 'react-native';

import MenuDev from './src/utils/menuDev.js';
import OutputScreen from 'developers-zone/src/Components /OutputScreen.js';
import loginSignUp from 'developers-zone/src/Components /loginSignUp.js';
import LoginScreen from 'developers-zone/src/Components /LoginScreen.js';
import PremiumScreen from 'developers-zone/src/Components /PremiumScreen';
import ConversationStarterPrem from 'developers-zone/src/Components /ConversationStarterPrem';
import ConversationStarterFree from 'developers-zone/src/Components /ConversationStarterFree';
import OccasionView from 'developers-zone/src/Components /OccasionView';
import SignUpForm from 'developers-zone/src/Components /SignUp/SignUpForm';
import TermsOfUseScreen from 'developers-zone/src/Components /SignUp/TermsOfUseComponent';
import LanguageSelectionScreen from 'developers-zone/src/Components /languageSelect.js';
import PrivacyPolicyScreen from './src/utils/PrivacyPolicyScreen';
import TermsOfUseTextScreen from './src/utils/TermsOfUseTextScreen';
import UpdateRequiredScreen from './src/Components /UpdateRequired';





const menuItems = [
  { label: 'OutputScreen', onPress: () => navigation.navigate('OutputScreen') },
  { label: 'loginSignUp', onPress: () => navigation.navigate('loginSignUp') },
  { label: 'LoginScreen', onPress: () => navigation.navigate('LoginScreen')},
  { label: 'PremiumScreen', onPress: () => navigation.navigate('PremiumScreen') },
  { label: 'ConversationStarterPrem', onPress: () => navigation.navigate('ConversationStarterPrem') },
  { label: 'ConversationStarterFree', onPress: () => navigation.navigate('ConversationStarterFree') },
  { label: 'PopUpTest', onPress: () => navigation.navigate('PopUpTest') },
  { label: 'OccasionView', onPress: () => navigation.navigate('OccasionView') },
  { label: 'SignUpForm', onPress: () => navigation.navigate('SignUpForm') },
  { label: 'TermsOfUseScreen', onPress: () => navigation.navigate('TermsOfUseScreen') },
];

LogBox.ignoreAllLogs(); //Ignore logs that match the text


function HomeScreen({ navigation }) {
  return (
    <View style={styles.homebackground}>
      
      <MenuDev menuItems={menuItems} navigation={navigation} />
    
    </View>
  );
}





const Stack = createStackNavigator();

const MainApp = () => {
  const { user } = useAuthentication();

  return (
    user ? (
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="OccasionView" component={OccasionView} />
        <Stack.Screen options={{headerShown: false}} name="OutputScreen" component={OutputScreen} />
        <Stack.Screen options={{headerShown: false}} name="PremiumScreen" component={PremiumScreen} />
        <Stack.Screen options={{headerShown: false}} name="ConversationStarterPrem" component={ConversationStarterPrem} />        
        <Stack.Screen options={{headerShown: false}} name="ConversationStarterFree" component={ConversationStarterFree} />
        <Stack.Screen options={{headerShown: false}} name="LanguageSelectionScreen" component={LanguageSelectionScreen} /> 
       
      </Stack.Navigator>
    ) : (
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="loginSignUp" component={loginSignUp} />
        <Stack.Screen options={{headerShown: false}} name="LoginScreen" component={LoginScreen} />
        <Stack.Screen options={{headerShown: false}} name="SignUpForm" component={SignUpForm} />
        <Stack.Screen options={{headerShown: false}} name="TermsOfUseScreen" component={TermsOfUseScreen} />
        <Stack.Screen options={{headerShown: false}} name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
        <Stack.Screen options={{headerShown: false}} name="TermsOfUseTextScreen" component={TermsOfUseTextScreen} />
      </Stack.Navigator>
    )
  );
};

const UpdateRequiredStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{headerShown: false}}
      name="UpdateRequiredScreen"
      component={UpdateRequiredScreen}
    />
  </Stack.Navigator>
);

export default function App() {
  
  const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);
  const [isUpdateRequired, setUpdateRequired] = useState(false);

  useEffect(() => {
    const authObserver = onAuthStateChanged(auth, (user) => {
      console.log("Firebase is initialized");

      setFirebaseInitialized(true);
    });
    return authObserver; // This ensures the listener is removed when the component is unmounted
  }, []);

  const checkForUpdates = async () => {
    const db = getFirestore();
    let currentVersion = 1;  // Replace with your app's current version

    const configDoc = await getDoc(doc(db, 'config', 'App'));

    if (configDoc.exists()) {
      let latestVersion = configDoc.data().latestVersion;
      console.log('Latest version: ' + latestVersion);

      if (latestVersion > currentVersion) {
        setUpdateRequired(true);
      }
    }
  };

  useEffect(() => {
    if (isFirebaseInitialized) {
      checkForUpdates();
    }
  }, [isFirebaseInitialized]);


  return (
    <NavigationContainer>
      {isUpdateRequired ? <UpdateRequiredStack /> : <MainApp />}
    </NavigationContainer>
  );
};


