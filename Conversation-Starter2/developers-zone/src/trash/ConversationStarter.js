import { StyleSheet, Text, View, FlatList, TextInput, Touch, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
const { Configuration, OpenAIApi } = require("openai");
import Header from '/Users/lorisgaller/Desktop/Github/Conversation-Starter2/developers-zone/src/Components /header.js';


const ConversationStarter = ({route, navigation}) => {
    //Hier wird das geklickte Icon aus dem IconWrapper übergeben, falls route != undefined ist bla bla bla
    let selectedIcon ='';
    if(route.params != undefined){
        selectedIcon = route.params;
        
    }
    
    
    
    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const [data, setData] = useState([]);
    const [textInput, setTextInput] = useState('') //setTextInput wird TextInput updaten
    const [inputCount, setInputCount] = useState(0);
    const [inputArray, setInputArray] = useState(['', '', '', '']);
    


    const handleSend = async () => {
        const updatedArray = [...inputArray];
        updatedArray[inputCount] = textInput.trim(); // Trim to remove any leading/trailing whitespace
        setInputArray(updatedArray);
        setInputCount(inputCount + 1);
        setTextInput(""); // Clear the input field
        setData([...data, { type: "user", text: updatedArray}]);
      };


    const handleSendArray = async function() {
        
        const prompt = "You're a conversation starting expert. The user gives you keywords about a situation and you give back the perfect sentence to start a conversation";
        const concatenatedString = inputArray
          .filter((input) => input !== "") // Filter out any empty inputs
          .join(", "); // Join inputs with ", "
        
        //console.log(concatenatedString+", Occasion: "+selectedIcon.selectedIcon);
        
        const response = await axios.post(apiUrl, {
            model: "gpt-3.5-turbo",
            messages: messages=[
                {"role": "system", "content": prompt}, 
                {"role": "user", "content": concatenatedString}
            ],
            max_tokens: 1024,
            temperature: 0.8,
        },{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${apiKey}`,
                'OpenAI-Organization' : 'org-Fj6flRfb4tQM5OXbBle6a2qX'
            }
        });

        

        const text = response.data.choices[0].message.content;
        console.log(text);
        const updatedArray = ['', '', '', ''];
        setData([...data, 
            {type: 'user', 'text': textInput}, 
            {type: 'bot', 'text': text}]);
        
        setTextInput('');
        setInputCount(0);
        setInputArray(updatedArray);
        let pass = text; //pass wird an OutputScreen übergeben - pass ist der Output von GPT-3
        navigation.navigate('OutputScreen', { pass });
    }

    return(
        <View style={styles.container}>
            
            
            <Header 
                title="Describe the Situation"
            />
            
            
            
            <Text style={styles.title}>
                Place:    {selectedIcon.selectedIcon}
            </Text>

        

        { <FlatList            
            style={styles.body}
        /> }

            <View style={{flexDirection: 'column', alignItems: 'center',}} >
                {inputArray.map((text, index) => (
                <TouchableOpacity key={index} style={{}} onPress={() => setTextInput(text)}>
                    <View style={{backgroundColor: 'white', padding: 10, borderRadius: 10, alignItems: 'center'}}>
                        <Text style={{fontSize: 16}}>{text === '' ? '        ' : text}</Text>
                    </View>
                </TouchableOpacity>
                ))}
            </View>

            <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding" keyboardVerticalOffset={90}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={textInput}
                        onChangeText={(text) => setTextInput(text)}
                        placeholder="Ask me anything"
                    />
                    <View style={styles.buttonContainer}>
                        {inputCount < 4 && (
                            <TouchableOpacity style={styles.button} onPress={handleSend}>
                                <Text style={styles.buttonText}>Input</Text>
                            </TouchableOpacity>
                        )}
                        {inputCount === 4 && (
                            <TouchableOpacity style={styles.buttonSendArray} onPress={() => {
                                handleSendArray();
                            }}>                                
                                <Text style={styles.buttonText}>Send Prompt</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ConversationStarter

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //backgroundColor: '#ffffff',
    },
    title:{
        fontSize: 30,
        fontWeight: 800,
        top: 0,
        color: '#000000',
    },
    body: {
        backgroundColor: '#ffffff',
        width: '100%',
    },
    bot:{
        fontSize: 16
    },
    input:{
        borderWidth: 1,
        borderColor: 'black',
        width: 200,
        height: 60,
        marginBottom: 10,
        borderRadius: 10,
    },
    button:{
        backgroundColor: 'lightblue',
        padding: 20,
        width: 100,
        
    },
    buttonSendArray:{
        backgroundColor: 'green',
        padding: 20,
        width: 100,
        
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        paddingHorizontal: 10,
        
    },
    keyboardAvoidingContainer: {
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        
    },
    
    
      

  });