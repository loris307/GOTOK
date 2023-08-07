// src/navigation/authStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../Components/LoginScreen';
import SignUpForm from '../Components/SignUp/SignUpForm';
import SignUpForm from 'developers-zone/src/Components /SignUp/SignUpForm';
import TermsOfUseScreen from 'developers-zone/src/Components /SignUp/TermsOfUseComponent';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpForm" component={SignUpForm} />
      <Stack.Screen options={{headerShown: false}} name="SignUpForm" component={SignUpForm} />
      <Stack.Screen options={{headerShown: false}} name="TermsOfUseScreen" component={TermsOfUseScreen} />
    </Stack.Navigator>
  );
}