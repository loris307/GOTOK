import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';
import UserContext from '../utils/UserContext.js'


const PremiumPurchaseScreen = () => {
    const { confirmSetupIntent, initPaymentSheet, presentPaymentSheet } = useStripe();
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentSheetReady, setPaymentSheetReady] = useState(false);
  
    const [isActive, setIsActive] = useState(null);

    const { isPremium, setIsPremium } = useContext(UserContext);



    useEffect(() => {
      fetchSetupIntent();
      checkSubscriptionStatus();
    }, []);

    const checkSubscriptionStatus = async () => {
        const functions = getFunctions();
        const checkSubscriptionStatusFunction = httpsCallable(functions, 'checkSubscriptionStatus');
        
        try {
            const response = await checkSubscriptionStatusFunction();
            setIsActive(response.data.hasActiveSubscription);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch subscription status.');
        }
    };
  
    const fetchSetupIntent = async () => {
    const functions = getFunctions();

      const createSetupIntentFunction = httpsCallable(functions,'createCheckoutSession');
      try {
        const response = await createSetupIntentFunction();
        setClientSecret(response.data.clientSecret);
  
        // Initialize the PaymentSheet with the SetupIntent's client secret.
        const { error } = await initPaymentSheet({
          customerId: response.data.customerId,
          customerEphemeralKeySecret: response.data.ephemeralKey,
          setupIntentClientSecret: response.data.clientSecret,
          merchantDisplayName: 'GoTok AI',
        });
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          setPaymentSheetReady(true); // Indicate that the PaymentSheet can be presented
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to fetch setup intent.');
    }
    };
  
    const handlePresentPaymentSheet = async () => {
      if (!clientSecret) return;
  
      const { error } = await presentPaymentSheet({ clientSecret });
  
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        handleStartSubscription();
      }
    };
  
    const handleStartSubscription = async () => {
      const functions = getFunctions();
      const startSubscriptionFunction = httpsCallable(functions,'startSubscription');
      try {
        // Pass the clientSecret to the backend function
        const response = await startSubscriptionFunction({ clientSecret });
    
        // Use the response's status to determine success
        if (response.data.status === "active") {
          Alert.alert('Success', 'Your subscription was successful!');
          setIsPremium(true);
        } else {
          Alert.alert('Error', 'Failed to create subscription.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to start subscription.');
      }
    };

    const handleCancelSubscription = async () => {
        const functions = getFunctions();
        const cancelSubscriptionFunction = httpsCallable(functions, 'cancelSubscription');
        try {
          const response = await cancelSubscriptionFunction();
          if (response.data.status === "canceled") {
            Alert.alert('Success', 'Your subscription has been canceled!');
            // Optionally, update any frontend state to reflect subscription cancellation
            setIsPremium(false);
          } else {
            Alert.alert('Error', 'Failed to cancel the subscription.');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to communicate with the server.');
        }
      };
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{isPremium === null ? 'Checking...' : isPremium.toString()}</Text>

        <Button 
          title="Enter Payment Details" 
          onPress={handlePresentPaymentSheet}
          disabled={!paymentSheetReady} // Disable the button until PaymentSheet is ready
        />

        <Button 
            title="Cancel Subscription" 
            onPress={handleCancelSubscription}
        />
      </View>
    );
  };
  
  export default PremiumPurchaseScreen;
