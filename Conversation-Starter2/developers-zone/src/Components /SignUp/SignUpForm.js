import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback } from 'react-native';

const languageOptions = [
  { label: 'German', value: 'de' },
  { label: 'English', value: 'en' },
  { label: 'Greek', value: 'gr' },
];


const SignUpForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLanguageSelect = (value) => {
    setLanguage(value);
    setIsModalVisible(false);
  };

  const handleContinue = () => {
    if(password !== passwordVerify){
      Alert.alert('Passwords do not match');
    } else {
      navigation.navigate('TermsOfUseScreen', { 
        name, 
        email, 
        password, 
        age, 
        gender, 
        language 
      })
    }
  }

  

  return (
    <TouchableWithoutFeedback>
    <View style={styles.container}>
      
      <Text style={styles.heading}>Create your Account</Text>

      <Text style={styles.labels}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.labels}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.labels}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.labels}>Verify Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Verify Password"
        secureTextEntry
        value={passwordVerify}
        onChangeText={setPasswordVerify}
      />
      
      <Text style={styles.labels}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.labels}>Gender</Text>
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />


      <Text style={styles.labels}>Language</Text>

      <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.languageBtn}>
        {language ? (
          <Text style={styles.selectedLanguage}>{languageOptions.find((option) => option.value === language)?.label}</Text>
        ) : (
          <Text style={styles.buttonTextLanguage}>Select Language</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Select Language</Text>
          {languageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.modalOption}
              onPress={() => handleLanguageSelect(option.value)}
            >
              <Text style={styles.modalOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
      

      <TouchableOpacity 
        onPress={handleContinue}  
        style={[
          styles.button, 
          (!email || !password || !passwordVerify || !name || !age || !gender || !language) && styles.disabledButton
        ]}
        disabled={!email || !password || !passwordVerify || !name || !age || !gender || !language}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>


    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 12,
  },

  labels: {
    fontSize: 15,
    marginBottom: 5,
    marginTop: 10,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'center',
  },

  button: {
    backgroundColor: '#B623A3',
    padding: 10,
    borderRadius: 12,
    width: '100%',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },

  buttonTextLanguage: {
    color: 'lightgrey',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B623A3',
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#B623A3',
  },
  languageBtn: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'darkgrey',
    height: 40,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#D3D3D3',
  },
});

export default SignUpForm;