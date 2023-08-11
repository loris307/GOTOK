import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuthentication } from '/Users/lorisgaller/Desktop/GoTok GitHub/GOTOK/Conversation-Starter2/developers-zone/src/Components /UserAuth/useAuthentication.ts';
import { getFunctions, httpsCallable } from 'firebase/functions';


const PremiumPurchaseScreen = () => {
    const { user } = useAuthentication();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [paymentIntent, setPaymentIntent] = useState(null);
  
    useEffect(() => {
      if (user) {
        initializePaymentSheet();
      }
    }, [user]);
  
    const initializePaymentSheet = async () => {
        const functions = getFunctions();
        const createCheckout = httpsCallable(functions, 'createCheckoutSession');
    
        try {
            const response = await createCheckout({ userId: user.uid });
    
            // Ensure the function call returns the expected data
            if (!response || !response.data) {
                Alert.alert('Error', 'Failed to initialize checkout.');
                return;
            }
    
            const { paymentIntent: pi, ephemeralKey, customer } = response.data;
    
            setPaymentIntent(pi);
    
            const { error } = await initPaymentSheet({
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: pi,
            });
    
            if (error) {
                Alert.alert('Error', 'Failed to initialize payment sheet.');
            }
    
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to initialize checkout.');
        }
    };
  
    const handlePurchase = async () => {
      if (!paymentIntent) return;
  
      const { error } = await presentPaymentSheet({ clientSecret: paymentIntent });
  
      if (error) {
        Alert.alert('Error', error.message || 'Payment failed.');
      } else {
        Alert.alert('Success', 'Your payment was successful!');
      }
    }
  
    return (
      <View style={styles.container}>
        <Text>Get Premium Features!</Text>
        <Button title="Buy Premium" onPress={handlePurchase} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
  
  export default PremiumPurchaseScreen;