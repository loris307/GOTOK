
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import './firebase.js';
import { auth } from './firebase.js';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { initStripe } from "@stripe/stripe-react-native";
import { getFunctions, httpsCallable } from 'firebase/functions';
//import 'expo-dev-client'
import mobileAds from 'react-native-google-mobile-ads';

initStripe({
  publishableKey: 'pk_test_51NcWqjAmn8sb0ycrVKjeLjD22QScb58tmTqI6sm8G5bIWcty51LXjor3FR5ej9M4UZHmP9GqPeWCzQv5CTsnXddy00znuKSE4t',
});


import { useAuthentication } from './src/Components /UserAuth/useAuthentication';


import { LogBox } from 'react-native';

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
import ManageAccount from './src/Components /ManageAccount.js';
import PremiumPurchaseScreen from './src/Components /PremiumPurchaseScreen';

import UserContext from '/Users/lorisgaller/Desktop/GoTok GitHub/GOTOK/Conversation-Starter2/developers-zone/src/utils/UserContext.js'

LogBox.ignoreAllLogs(); //Ignore logs that match the text


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
        <Stack.Screen options={{headerShown: false}} name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
        <Stack.Screen options={{headerShown: false}} name="TermsOfUseTextScreen" component={TermsOfUseTextScreen} />
        <Stack.Screen options={{headerShown: false}} name="ManageAccount" component={ManageAccount} />

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
  const [isPremium, setIsPremium] = useState(false);  // <-- Initialize the state for isPremium


  useEffect(() => {
    const authObserver = onAuthStateChanged(auth, async (user) => {
      console.log("Firebase is initialized");

      setFirebaseInitialized(true);
      if (user) {
        await checkSubscriptionStatus();
      }
    });
    return authObserver; // This ensures the listener is removed when the component is unmounted
  }, []);

  const checkSubscriptionStatus = async () => {
    const functions = getFunctions();
    const checkSubscriptionStatusFunction = httpsCallable(functions, 'checkSubscriptionStatus');
    
    try {
        const response = await checkSubscriptionStatusFunction();
        if (response.data.hasActiveSubscription) {
            setIsPremium(true);
        } else {
            setIsPremium(false);
        }
    } catch (error) {
        Alert.alert('Error', 'Failed to fetch subscription status.');
    }
};

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
      <UserContext.Provider value={{ isPremium, setIsPremium }}>
      <StripeProvider
        publishableKey="pk_test_51NcWqjAmn8sb0ycrVKjeLjD22QScb58tmTqI6sm8G5bIWcty51LXjor3FR5ej9M4UZHmP9GqPeWCzQv5CTsnXddy00znuKSE4t"
        merchantIdentifier="merchant.com.gotokai"
      >
        {isUpdateRequired ? <UpdateRequiredStack /> : <MainApp />}
      </StripeProvider>
      </UserContext.Provider>
    </NavigationContainer>
  );
};


