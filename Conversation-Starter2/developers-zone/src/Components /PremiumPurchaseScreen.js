import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';


const PremiumPurchaseScreen = () => {
    const { confirmSetupIntent, initPaymentSheet, presentPaymentSheet } = useStripe();
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentSheetReady, setPaymentSheetReady] = useState(false);
  
    const [isActive, setIsActive] = useState(null);


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
        } else {
          Alert.alert('Error', 'Failed to create subscription.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to start subscription.');
      }
    };
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{isActive === null ? 'Checking...' : isActive.toString()}</Text>

        <Button 
          title="Enter Payment Details" 
          onPress={handlePresentPaymentSheet}
          disabled={!paymentSheetReady} // Disable the button until PaymentSheet is ready
        />
      </View>
    );
  };
  
  export default PremiumPurchaseScreen;
