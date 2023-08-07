import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Keyboard, Image, TouchableWithoutFeedback} from 'react-native';
import Slider from '@react-native-community/slider';
import { useRef } from 'react';
import Header from '../utils/header';
import i18n from '../../i18n.js';

//functions 
import 'firebase/functions';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../firebase.js';

const functions = getFunctions(app);


const ConversationStarterFree = ({route, navigation}) => {

 
  const [gender, setGender] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [input5, setInput5] = useState('');
  const charLimitGender = 20; // considering an average word length of 5 characters, and some spaces


  let selectedIcon ='';
    if(route.params != undefined){
        selectedIcon = route.params;
        
    }

  //Gender Input char limit
  const handleInputChange2 = (text) => {
    if (text.length <= charLimitGender) {
     setGender(text);
    }
  }

  const [selectedStyleIcon, setSelectedStyleIcon] = useState(null);

  //Age Range
  const [age, setAge] = useState(18); // Initial age value

  const handleAgeChange = (value) => {
    setAge(value); // Update the age value when the slider value changes
  };

  //Icons for the Style
  const handleIconPress = (iconName) => { // iconName is the name of the icon that was pressed
    setSelectedStyleIcon(iconName); // Update the state with the name of the icon that was pressed
    console.log(iconName);

  };

  const isIconSelected = (iconName) => { // iconName is the name of the icon that we want to check if it is selected
    return iconName === selectedStyleIcon; // Return true if the icon is selected, false otherwise
  };

  //The Inputs 

  const input4Ref = useRef();
  const input5Ref = useRef();

  const handleInput3Submit = () => {
    input4Ref.current.focus();
  };

  const handleInput4Submit = () => {
    input5Ref.current.focus();
  };

  const handleInput5Submit = () => {
    Keyboard.dismiss();
  };


  //for Count
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };


  const send = async () => {
    // Prepare the data object
    const formData = {
      Gender: "Talking to a: "+gender,
      Count: "Number of people: "+count,
      Situation: "The Situation is: "+input3+" + "+input4+" + "+input5,
      Style: "Output Style: "+selectedStyleIcon,
      Age: "Age: "+age,
      Occasion: "Occasion: "+selectedIcon.selectedIcon,
      Location: "Output Language: "+i18n.locale//I want the language to be added here
    };


    //Ab hier wird gesendet
    const prompt = "Generate a creative, situation-specific, and culturally-sensitive conversation starter line that combines the talking styles of the worlds most renowned dating experts and stand-up comedians. The pickup line should be concise, strictly within 50 words, and based on user-provided details, including occasion, person description, current activity, and overall vibe. Remember always to never mention and refer the name of the dating expert or stand-up comedian at the prompt generation result. Ensure the pickup line is engaging, not cheesy or slimy, and functions as an icebreaker with subtle flirty undertones. Consider local customs, social norms, and regional language variations while crafting the line. The language of the Output is always specified. Only use the specified language for your Output.";
    const concatenatedString = Object.values(formData)
        .filter((input) => input !== "") // Filter out any empty inputs
        .join(", "); // Join inputs with ", "

        console.log(concatenatedString);

        
        // Call the Cloud Function
        const generateConversationStarter = httpsCallable(functions, 'generateConversationStarter');
        const response = await generateConversationStarter({ prompt, concatenatedString });
        

        const text = response.data;
        console.log(text);
        let pass = text; //pass wird an OutputScreen übergeben - pass ist der Output von GPT-3
        let iconpass = selectedStyleIcon; //---------------------------------------------
        navigation.navigate('OutputScreen', { pass, iconpass }); //---------------------------------------------
  };

  return (
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.mainContainer}>

    <Header 
        title={'Describe the Situation'}
    />
    
    <View style={styles.contentContainer}>
      

      <View style={styles.containerGenNum}>
        <View style={styles.talkingTo}>
            <Text>{i18n.t("talkingto")} </Text>
            <TextInput
            style={styles.input}
            value={gender}
            onChangeText={handleInputChange2}
            />
        </View>
        

        <View >
            <Text>{i18n.t("count")}</Text>
            
            <View>


                <View style={styles.containerCount}>
                    <TouchableOpacity onPress={decrementCount} style={styles.buttonCount}>
                        <Text style={styles.buttonCountText}>-</Text>
                    </TouchableOpacity>
                        <View style={styles.countTextContainer}>
                          <Text style={styles.countText}>{count}</Text>
                        </View> 
                    <TouchableOpacity onPress={incrementCount} style={styles.buttonCount}>
                        <Text style={styles.buttonCountText}>+</Text>
                    </TouchableOpacity>
                </View>

            </View>
            
            
        </View>
        
      </View>
      


      <View style={styles.situationContainer}>
      <Text style={styles.exampleText}>{i18n.t("example1")}</Text>
      <TextInput
        style={styles.descriptionInput}
        value={input3}
        onChangeText={text => setInput3(text)}
        onSubmitEditing={handleInput3Submit}
        blurOnSubmit={false}
      />

      <Text style={styles.exampleText}>{i18n.t("example2")}</Text>
      <TextInput
        style={styles.descriptionInput}
        value={input4}
        onChangeText={text => setInput4(text)}
        onSubmitEditing={handleInput4Submit}
        blurOnSubmit={false}
        ref={input4Ref}
      />

      <Text style={styles.exampleText}>{i18n.t("example3")}</Text>
      <TextInput
        style={styles.descriptionInput}
        value={input5}
        onChangeText={text => setInput5(text)}
        onSubmitEditing={handleInput5Submit}
        blurOnSubmit={true}
        ref={input5Ref}
      />
    </View>

      <View>
      <Text>{i18n.t("outputStyle")}</Text>
      <View style={styles.iconRow}>

        <TouchableOpacity
            style={[styles.firstIcon, isIconSelected('funny') && styles.selectedIcon]}
            onPress={() => handleIconPress('funny')}
        >
          <Image
            source={
              isIconSelected('funny')
                ? require('developers-zone/src/assets/StyleIcons/FunnyDoc.png')
                : require('developers-zone/src/assets/newStyleIcons/funny.png')
            }
            style={[styles.image, isIconSelected('funny') && styles.selectedImage]}
          />
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.icon, isIconSelected('friendly') && styles.selectedIcon]}
            onPress={() => handleIconPress('friendly')}
        >
          <Image
            source={
              isIconSelected('friendly')
                ? require('developers-zone/src/assets/StyleIcons/friendly.png')
                : require('developers-zone/src/assets/newStyleIcons/friendly.png')
            }
            style={[styles.image, isIconSelected('friendly') && styles.selectedImage]}
          />
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.icon, isIconSelected('Romantic') && styles.selectedIcon]}
            onPress={() => handleIconPress('Romantic')}
        >
          <Image
            source={
              isIconSelected('Romantic')
                ? require('developers-zone/src/assets/StyleIcons/RomanticDoc.png')
                : require('developers-zone/src/assets/newStyleIcons/Romantic.png')
            }
            style={[styles.image, isIconSelected('friendly') && styles.selectedImage]}
          />
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.icon, isIconSelected('Slang') && styles.selectedIcon]}
            onPress={() => handleIconPress('Slang')}
        > 
          <Image
            source={
              isIconSelected('Slang')
                ? require('developers-zone/src/assets/StyleIcons/SlangDoc.png')
                : require('developers-zone/src/assets/newStyleIcons/Slang.png')
            }
            style={[styles.image, isIconSelected('friendly') && styles.selectedImage]}
          />
        </TouchableOpacity>


      </View>
      </View>
      

        <View style={styles.ageContainer}>
            <Text>{i18n.t("age")} {age}</Text>
            <Slider
                style={{ width: '80%', alignSelf: 'center', marginTop: 10 }}
                minimumValue={18} // Minimum age value
                maximumValue={95} // Maximum age value
                step={1} // Increment step
                value={age} // Current age value
                onValueChange={handleAgeChange} // Handle age change
            />
        </View>
      


        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonSend} onPress={send}>
                <Text style={styles.buttonText}>{i18n.t("sendPromptbtn")}</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonBack} onPress={() => {navigation.navigate('OccasionView')}} >
                <Text style={styles.buttonBackText}>{i18n.t("backToOccasion")}</Text>
            </TouchableOpacity>
        </View>

    </View>

    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        backgroundColor: '#fff',

    },

    contentContainer: {
        //flex: 1,
        padding:  25,
        justifyContent: 'space-between',
    },

    input: {
        height: 50,
        marginTop: 10,
        width: '80%',
        borderWidth: 1,
        borderRadius: 10,
        backgorundColor: '#ffffff',
        padding: 10,
    },
    

    //Button

    buttonContainer: {
        alignItems: 'center',
    },

    buttonSend: {
        backgroundColor: '#B623A3',
        padding: 10,
        width: '80%',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: '#ffffff',
    },

    //Gender und count

    containerGenNum: {
        flexDirection: 'row',
        //alignItems: 'center',
        width: '50%',
        justifyContent: 'space-between',
        //width: '100%',
        marginBottom: 10,
    },

    talkingTo: {
        marginRight: 10,
        width: '100%',
    },

    //Counter

    containerCount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        marginTop: 10,
      },

      countTextContainer: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        height: 50,
        backgroundColor: '#B623A3',
        borderColor: '#B623A3',
      },

      buttonCount: {
        margin: 3,
        width: '22%',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#B623A3',
        backgroundColor: '#ffffff',
      },

      buttonCountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#B623A3',
      },
      countText: {
        fontSize: 18,
        color: 'white',
      },

    //Situation 
    

    situationContainer: {
        marginTop: 10,
        marginBottom: 10, //----------------------------->>>>>
    },

    tellGoTok: {
        flexDirection: 'row',
        alignItems: 'center',
        
        marginTop: 10,
    },

    tellGoTokText: {
        fontSize: 10,
        color: '#ACACAC',
        marginTop: 10,
    },

    examplesContainer: {
        marginLeft: 10,
      },

    descriptionInput: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        backgorundColor: '#ffffff',
        padding: 10,
        marginBottom: 10,
        marginTop: 5,
    },
    
    exampleText: {
        fontSize: 10,
        color: '#ACACAC',
    },

    //Icons bzw. Style  
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        //alignSelf: 'center',  //----------------------------->>>>>
        marginTop: 10,
        width: '90%', //----------------------------->>>>>
    },

    icon: {
      padding: 1,
      marginLeft: 5,
      paddingLeft: 0,
      shadowColor: '#B623A3',
      shadowOffset: { width: 3, height: 5 },
      shadowOpacity: 1,
  },

  firstIcon:{
      padding: 1,
      paddingLeft: 0,
      marginLeft: 0,
      shadowColor: '#B623A3',
      shadowOffset: { width: 3, height: 5 },
      shadowOpacity: 1,
      
  },
  
  selectedIcon: {
      borderRadius: 16,
      shadowColor: '#B623A3',
      shadowOffset: { width: 3, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 5,
      transform: [{ scale: 1.07 }],
      transitionProperty: 'transform',
      transitionDuration: '3s',
    },


    

    image: {
        width: 75, 
        height: 75, 
        alignSelf: 'center', 
        resizeMode: 'contain',
        marginLeft: 1,
    },

    
    //age 

    ageContainer: {
      marginBottom: 20,
      marginTop: 20,
  },


  //Back Button
  buttonBack: { 
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B623A3',
    width: '80%',
    marginTop: 10,
  },

  buttonBackText: {
    color: '#B623A3',
    textAlign: 'center',
    fontSize: 18,
  },

    

    

});

export default ConversationStarterFree;