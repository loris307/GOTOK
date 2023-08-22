import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';
import UserContext from '/Users/lorisgaller/Desktop/GoTok GitHub/GOTOK/Conversation-Starter2/developers-zone/src/utils/UserContext.js'

const ManageAccount = ({ navigation }) => {
    const [username, setUsername] = useState('John Doe');  // Assuming the username as a placeholder
    const [email, setEmail] = useState('johndoe@example.com');
    const { isPremium, setIsPremium } = useContext(UserContext);
    
    //Invoices stuff
    const [invoices, setInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);

    //Activity Indicator
    const [loading, setLoading] = useState(false);

    
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
            <Text style={styles.greeting}>Hello, {username}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subscription Details</Text>
                <Text>Your subscription is currently: {isPremium ? 'Active' : 'Inactive'}</Text>
                {/*Other subscription details like renewal date, price, etc. */}
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Manage Subscription</Text>
                <TouchableOpacity style={styles.touchableButton} onPress={() => {/* Handle payment details update */}}>
                  <Text style={styles.buttonText}>Update Payment Details</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={styles.touchableButton} onPress={handleCancelSubscription}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Cancel Subscription</Text>
                  )}
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Billing History</Text>
              <TouchableOpacity onPress={fetchInvoices}>
                  <Text style={styles.link}>View your past invoices and payments</Text>
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
                <Text style={styles.sectionTitle}>Legal</Text>
                <TouchableOpacity onPress={() => navigation.navigate('TermsOfUseTextScreen')}>
                    <Text style={styles.link}>Terms of Service</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
                    <Text style={styles.link}>Privacy Policy</Text>
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