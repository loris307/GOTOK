import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import PremiumScreenPopUp from './PremiumScreenPopUp';
import Header from '../utils/header';
import i18n from '../../i18n.js';
import 'firebase/functions';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../firebase.js';
import * as Clipboard from 'expo-clipboard';
import UserContext from '/Users/lorisgaller/Desktop/GoTok GitHub/GOTOK/Conversation-Starter2/developers-zone/src/utils/UserContext.js'



import funnyImage from 'developers-zone/src/assets/OPStyleIcons/OPFunny.png';
import friendlyImage from 'developers-zone/src/assets/OPStyleIcons/OPFriendly.png';
import slangImage from 'developers-zone/src/assets/OPStyleIcons/OPCool.png';
import romanticImage from 'developers-zone/src/assets/OPStyleIcons/OPRomantic.png';
import logo from 'developers-zone/src/assets/logoGoTok.png';

import advice_en from 'developers-zone/src/assets/advices/advice_en.js';
import advice_de from 'developers-zone/src/assets/advices/advice_de.js';
import advice_gr from 'developers-zone/src/assets/advices/advice_gr.js';



const OutputScreen = ({ navigation, route }) => {
  const { pass: initialPass, iconpass: initialIconpass, formData } = route.params;
  
  // Add state variables for pass and iconpass
  const [pass, setPass] = useState(initialPass);
  const [iconpass, setIconpass] = useState(initialIconpass);
  
  //Premium feature
  const { isPremium, setIsPremium } = useContext(UserContext);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);


  //Spacer to center the text in free version
  const Spacer = () => {
    if (isPremium) {
        return null;
    }
    return <View style={{ height: 50 }} />;
};

  const functions = getFunctions(app);

  console.log(pass);
  console.log(iconpass);
  
  const [regenerating, setRegenerating] = useState(false);

  const regenerate = async () => {
    setRegenerating(true);

    const prompt = 'Generate a short, creative, context-specific, and culturally-sensitive conversation starter line that combines the talking styles of renowned stand-up comedians and top-notch dating experts, without explicitly naming any. The pickup line should be engaging, original, not cheesy, and serve as an entertaining icebreaker with subtle flirty undertones. Keep it within a 25-word limit, based on user input details such as who the user is talking to, the number of people involved, the scenario, the users preferred output style, the age of the person the user is talking to, the occasion, and the preferred output language. Use this information as context for generating a suitable line, not as a source for direct quotations. Adjust to local customs, social norms, and regional language variations. Always generate the output in the specified language. Do not include additional comments or notes using brackets, asterisks, or colons. For example: User Input: User is talking to: female, Number of people:1, The scenario is: She is doing cocaine at the bar non-stop, Preferred Output Style: slang, Age of the Person User is Talking to: 90, Occasion: Night Club, Preferred Output Language: en | Output: Hey Grandma, you sure are giving that coke the respect it deserves! You remind me of a cross between a boss and Betty Whit. Mind if I join in and we keep this party all night long?';
    const concatenatedString = Object.values(formData).join(", ");
  
    // Call the Cloud Function
    const generateConversationStarter = httpsCallable(functions, 'generateConversationStarter2');
    try{
      console.log("Calling generateConversationStarter");
      const response = await generateConversationStarter({  prompt, concatenatedString, isPremium  });

      setRegenerating(false);
    
      const text = response.data;
      console.log(text);
      
      //sample text to try
      //let sample = "Hey there, did it hurt when you fell from the profile picture? Because you're definitely rocking that digital gravity! 😉 #Swipehjz uzgb uzgub zgug jkbnkjb iuib iuhib"
      
      setPass(text);
      //setPass(sample);
      //setIconpass(formData.Style.split(': ')[1]); // Assuming Style: "Output Style: someIconStyle"
      
    }catch (error) {
      console.log(error);
      if (!isPremium) {
          setShowPremiumPopup(true);
      } else {
          Alert.alert(
              "Error", 
              error.message,
              [
                  {text: "OK", onPress: () => console.log("OK Pressed")}
              ],
              { cancelable: false }
          );
      }
  }
};
    
    const [advice, setAdvice] = useState([]);

    // Get advice for the correct language when the component mounts or the language changes
    useEffect(() => {
      let adviceList;
      switch(i18n.locale) {
        case 'en':
          adviceList = advice_en;
          break;
        case 'de':
          adviceList = advice_de;
          break;
        case 'gr':
          adviceList = advice_gr;
          break;
        default:
          adviceList = advice_en;
      }
      setAdvice(adviceList);  // Set the advice list for the selected language
    }, [i18n.locale]);

    useEffect(() => {
      // Get a random index once the advice list is set or changed
      if (advice && advice.length > 0) {
        const index = Math.floor(Math.random() * advice.length);
        setRandomIndex(index);
      }
    }, [advice]);
    
    
    // Conditionally set the image source based on iconpass
  let imageSource;
  
  switch (iconpass) {
    case 'funny':
      imageSource = funnyImage;
      break;
    case 'friendly':
      imageSource = friendlyImage;
      break;
    case 'Slang':
      imageSource = slangImage;
      break;
    case 'Romantic':
      imageSource = romanticImage;
      break;
    default:
      imageSource = logo;
      break;
  }

  //Copying to Cliboard
  const copyToClipboard = () => {
    Clipboard.setString(pass);
    Alert.alert('Success', 'Text copied to clipboard');
  };
  


    const [showPopup, setShowPopup] = useState(false);
    const [randomIndex, setRandomIndex] = useState(0);

  
    //Function to toggle the popup
    const togglePopup = () => {
      setShowPopup(!showPopup);
    };



    return (
      <View style={styles.container} >

        <Header 
          title={i18n.t("titleOutput")} 
        />

        <View style={{...styles.mainContainer, justifyContent: 'center', alignItems: 'center'}} >
          {showPopup && <PremiumScreenPopUp navigation={navigation} onClose={togglePopup} />}

        

          {imageSource && <Image source={imageSource} style={styles.styleIconImage} />}

          <Spacer /> 


          <Text 
            style={[
            isPremium ? (pass.length > 140 ? styles.longText : styles.text) : styles.text
            ]}
            onPress={copyToClipboard}
          >
            {pass} 
          </Text>
        

          {isPremium && (
            <View style={styles.adviceContainer}>
              <Text style={[styles.heading, pass.length > 130 && pass.length < 140 ? styles.adivceLong : null]}>
                {i18n.t("expertAdvice")} 
              </Text>

              <Text style={styles.advice}>
                {advice[randomIndex]} 
              </Text>
            </View>
          )}

          <View style={styles.buttoncontainer} >
              
              
            <TouchableOpacity style={styles.btnRegenerate} onPress={regenerate} disabled={regenerating}>
              
            
            {regenerating ? (
            <ActivityIndicator size="small" color="white" /> // Show loading spinner if loading
            ) : (
              <Text style={styles.btnTextRegenerate}> {i18n.t("renegerate")}</Text>// Show button text if not loading
            )}
              
              
            </TouchableOpacity> 
              
              <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ConversationStarterPrem')}>
                <Text style={styles.btnText}>
                {i18n.t("generateNewBtn")}
               </Text>
              </TouchableOpacity>

          </View>
          
        </View>
        {showPremiumPopup && <PremiumScreenPopUp onClose={() => setShowPremiumPopup(false)} navigation={navigation} />}

      </View>

      
      
    );
  };
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },

    
    mainContainer: {
        flex: 1,
        alignItems: 'center',
      },

    buttoncontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    btn:{
        backgroundColor: 'white',
        width: '90%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#B623A3',
    },

    longText: {
      fontSize: 18, 
      lineHeight: 26,
      marginBottom: 10,
    },
    text:{
      fontSize: 20,
      lineHeight: 30,
      alignContent: 'center',
      padding: 15,
      textAlign: 'center',
      marginTop: 20,
      width: '90%',   
      marginBottom: 40,
  },

    infoRow:{
      flexDirection: 'row',
      alignItems: 'center',
      
    },

    icon:{
      //marginTop: 20,
      //marginRight: 10,
    },

    styleIconImage:{
      width: 68,
      height: 78,
      resizeMode: 'contain',
      marginBottom: 50,
      marginTop: 20,
      
    },

    advice:{
        fontSize: 15,
        //fontStyle: 'italic',
        alignContent: 'center',
        textAlign: 'center',
        //padding: 20,
        marginBottom:10,
        lineHeight: 24,
        marginLeft: 20,
        marginRight: 20,
        width: '90%',
    },

    adivceLong:{
      marginTop: -30,
    },

    infoText:{
        fontSize: 12,
        marginTop: 20,
    },
    adviceContainer:{
      marginTop: 30,
      width: '90%',
    },
    btnText:{
      color: '#B623A3',
    },
    btnRegenerate:{
      backgroundColor: '#B623A3',
        width: '90%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },

    btnTextRegenerate:{
      
      color: '#ffffff',
    },

    heading:{
        fontSize: 16,
        alignContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginBottom:10,
        textAlign: 'center',
        fontWeight: 'bold',
        //marginTop: -30,
    }

  });
  
  export default OutputScreen;