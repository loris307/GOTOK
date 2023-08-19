import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';
import UserContext from '/Users/lorisgaller/Desktop/GoTok GitHub/GOTOK/Conversation-Starter2/developers-zone/src/utils/UserContext.js'

const ManageAccount = ({ navigation }) => {
    const [username, setUsername] = useState('John Doe');  // Assuming the username as a placeholder
    const [email, setEmail] = useState('johndoe@example.com');
    const { isPremium, setIsPremium } = useContext(UserContext);

    const handleCancelSubscription = async () => {
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
        }
      };

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Hello, {username}</Text>
            <Button 
            title="Cancel Subscription" 
            onPress={handleCancelSubscription}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
    }
});

export default ManageAccount;
