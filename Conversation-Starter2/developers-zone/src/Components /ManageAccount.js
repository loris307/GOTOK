import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';
import UserContext from '../utils/UserContext.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Stripe } from '@stripe/stripe-react-native';
import { useStripe } from '@stripe/stripe-react-native';

import i18n from '../../i18n.js';



const ManageAccount = ({ navigation }) => {
    const [username, setUsername] = useState('');  // Initializing with an empty string
    const [email, setEmail] = useState('johndoe@example.com');
    const { isPremium, setIsPremium } = useContext(UserContext);
    
    //Invoices stuff
    const [invoices, setInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);

    //Payment stuff
    const { confirmSetupIntent, initPaymentSheet, presentPaymentSheet } = useStripe();
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentSheetReady, setPaymentSheetReady] = useState(false);

    //Activity Indicator
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      // Fetch user's data from Firestore when the component mounts
      const fetchUserData = async () => {
          const auth = getAuth();
          const uid = auth.currentUser?.uid;

          if (uid) { // Ensure uid is available
              const db = getFirestore();
              const userDoc = await getDoc(doc(db, 'users', uid));

              if (userDoc.exists()) {
                  setUsername(userDoc.data().name || ''); // use the name if it exists, otherwise default to an empty string
              }
          }
      }

      fetchUserData();
    }, []); 

    
    const fetchInvoices = async () => {
        setLoadingInvoices(true);
        try {
            const functions = getFunctions();
            const getUserInvoicesFunction = httpsCallable(functions, 'getUserInvoices');
            const response = await getUserInvoicesFunction();
            setInvoices(response.data.invoices);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch the invoices.');
        }
        setLoadingInvoices(false);
    };


    //updating payment details
    const fetchSetupIntent = async () => {
      const functions = getFunctions();
      const createSetupIntentFunction = httpsCallable(functions, 'createCheckoutSession');
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
          setPaymentSheetReady(true); 
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to fetch setup intent.');
      }
    };

    const handlePresentPaymentSheet = async () => {
      if (!clientSecret) return;
    
      const functions = getFunctions();
      const notifyBackendOfCompletionFunction = httpsCallable(functions, 'setDefaultPaymentMethod');
    
      const { error } = await presentPaymentSheet({ clientSecret });
    
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        try {
            // You don't need the customer's latest payment method ID now.
            // The backend will take care of fetching and setting the latest payment method.
            const response = await notifyBackendOfCompletionFunction();
            if (response.data.success) {
                Alert.alert('Success', 'Payment method updated successfully!');
            } else {
                Alert.alert('Error', 'Failed to update default payment method. Please try again.');
            }
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to notify backend.');
        }
      }
    };
    
    
    
    

    
    //User cancellation of subscription
    const handleCancelSubscription = () => {
      Alert.alert(
        "Confirmation", // title
        "Are you really sure about that?", // message
        [
          {
            text: "Cancel",
            onPress: () => {}, // do nothing on cancel
            style: "cancel"
          },
          {
            text: "Yes, I'm sure", 
            onPress: async () => {
              setLoading(true);  // Start the loading spinner
              const functions = getFunctions();
              const cancelSubscriptionFunction = httpsCallable(functions, 'cancelSubscription');
              try {
                const response = await cancelSubscriptionFunction();
                if (response.data.status === "canceled") {
                  setIsPremium(false);
                  Alert.alert('Success', 'Your subscription has been canceled!', [
                      { text: 'OK', onPress: () => navigation.navigate('OccasionView') }
                  ]); 
                } else {
                  Alert.alert('Error', 'Failed to cancel the subscription.');
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to communicate with the server.');
              }finally {
                setLoading(false);  // Stop the loading spinner
              }
            }
          }
        ],
        { cancelable: true } // Allow user to dismiss the Alert by tapping outside of it
      );
    };


      return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.greeting}>{i18n.t("greeting")}, {username}! 👋</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{i18n.t("subscriptionDetails")}</Text>
                <Text>{i18n.t("subscriptionDetails2")} {isPremium ? 'Active' : 'Inactive'}</Text>
                {/*Other subscription details like renewal date, price, etc. */}
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{i18n.t("manageSubscription")}</Text>
                <TouchableOpacity style={styles.touchableButton} onPress={paymentSheetReady ? handlePresentPaymentSheet : fetchSetupIntent}>
                    <Text style={styles.buttonText}>{i18n.t("updatePayment")}</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={styles.touchableButton} onPress={handleCancelSubscription}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>{i18n.t("cancelSub")}</Text>
                  )}
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{i18n.t("billingHistoryHeader")}</Text>
              <TouchableOpacity onPress={fetchInvoices}>
                  <Text style={styles.link}>{i18n.t("paymentHistory")}</Text>
              </TouchableOpacity>

                {loadingInvoices && <ActivityIndicator size="small" color="#0000ff" />}

              <ScrollView style={styles.invoiceScrollView} showsVerticalScrollIndicator={true}>
                {invoices.map((invoice, index) => (
                <View key={invoice.id} style={styles.invoice}>
                  <Text>{new Date(invoice.date * 1000).toLocaleDateString()} - ${invoice.amount_paid / 100} - {invoice.status}</Text>
                </View>
                ))}
              </ScrollView>
            </View>


            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{i18n.t("legalHeader")}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('TermsOfUseTextScreen')}>
                    <Text style={styles.link}>{i18n.t("termsofService")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
                    <Text style={styles.link}>{i18n.t("privacyPolicy")}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
        justifyContent: 'center',  // This will center the main content

    },
    greeting: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    invoiceScrollView: {
      maxHeight: 200,  // Adjust this value based on the height of each invoice item.
  },
    section: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 5,
    },
    link: {
        color: '#007BFF',
        textDecorationLine: 'underline',
        marginTop: 5,
    },
    touchableButton: {
      backgroundColor: '#B623A3', // Example blue color
      padding: 10,
      borderRadius: 5,
      alignItems: 'center', // This will center the text inside
      marginTop: 10,
  },
  
  buttonText: {
      color: 'white',
      fontSize: 16,
  },
  invoice: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
},
});

export default ManageAccount;