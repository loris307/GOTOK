import React, { useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter } from 'react-native';

import i18n from '../../i18n.js';
import { Picker } from '@react-native-picker/picker';

const LanguageSelectionScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('en');
  const [viewState, setViewState] = useState(0);


  const handleLanguageChange = () => {
    i18n.locale = language;
    DeviceEventEmitter.emit('languageChange');
    setViewState(prevState => prevState + 1);

  };


  return (
    <View style={styles.container}>
      <Text style={styles.label}>{i18n.t("language")}</Text>
      <Picker
        style={styles.picker}
        selectedValue={language}
        onValueChange={(itemValue) => setLanguage(itemValue)}
      >
        <Picker.Item label="Deutsch" value="de" />
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Ελληνικά" value="gr" />
        <Picker.Item label="Español" value="mx" />
        <Picker.Item label="Italiano" value="it" />
        <Picker.Item label="Français" value="fr" />
        <Picker.Item label="Português" value="pt" />
        <Picker.Item label="Русский" value="ru" />
        <Picker.Item label="한국어" value="kr" />
        <Picker.Item label="中文" value="zh" />
        <Picker.Item label="हिन्दी" value="hi" />
        <Picker.Item label="українська" value="ukr" />
        <Picker.Item label="Nederlands" value="nl" />
        <Picker.Item label="日本語" value="jp" />

        

      </Picker>
      <TouchableOpacity style={styles.buttonSend} onPress={() => {handleLanguageChange(); navigation.navigate('OccasionView');}}>
       <Text style={styles.buttonText}>{i18n.t("languagebtn")}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('OccasionView')} style={styles.button}>
            <Text style={styles.homebuttonText}>{i18n.t("backhomeBtn")}</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontSize: 25,
    //marginBottom: 8,
    //fontStyle: 'bold',
  },
  picker: {
    width: '100%',
    height: 40,
    marginBottom: 150,
  },
  buttonSend: {
    backgroundColor: '#B623A3',
    padding: 10,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
},
buttonText: {
    fontSize: 20,
    color: '#ffffff',
},

homebuttonText: {
  fontSize: 20,
  color: '#B623A3',
},

button: {
  //backgroundColor: '#AA00FF',
  padding: 10,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#B623A3',
  width: '80%',
  alignItems: 'center',
  marginBottom: 10,
  backgroundColor: 'white',
  marginTop: 16,
},
});

export default LanguageSelectionScreen;