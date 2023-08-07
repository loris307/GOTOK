import React, { useState } from 'react';
import { Button, StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { chunk } from 'lodash';
//import styles from '/Users/lorisgaller/Desktop/Github/Conversation-Starter2/developers-zone/src/assets/styles.js';
import { SearchBar } from 'react-native-elements';
import Header from '/Users/lorisgaller/Desktop/Github/Conversation-Starter2/developers-zone/src/Components /header.js';
import icons from '../assets/icons';


function IconWrapper({icon, navigation}) {
    return (
      
      <TouchableOpacity onPress={() => navigation.navigate('ConversationStarterPrem', {selectedIcon: icon})}>
  
        <View style={styles.iconContainer}>
          <Icon name={icon} style={styles.iconstyle} color="#B623A3" />
        </View>
  
      </TouchableOpacity>
    );
  }
  
const ScollView = ({ navigation }) => {
    const iconRows = chunk(icons, 3); // split icons into rows of 3
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredIcons, setFilteredIcons] = useState(icons);
  
    const handleSearch = (query) => {
      setSearchQuery(query);
      const filteredIcons = icons.filter((icon) =>
        icon.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredIcons(filteredIcons);
    };
  
    return (

      <View style={styles.homebackground}>

        <Header
          title="Occasion"
        />
      
      
      <ScrollView style={styles.homebackground}>

       <View style={styles.searchBarContainer}>

          <SearchBar
            containerStyle={styles.searchBar}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            placeholder="Search..."
            onChangeText={handleSearch}
            value={searchQuery}
          />

          <Text style={styles.chooseText}>
            Choose or type where you are
          </Text>

        </View> 
        
        {chunk(filteredIcons, 3).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.iconRow}>
            {row.map((icon, iconIndex) => (
              <IconWrapper
                key={iconIndex}
                navigation={navigation}
                icon={icon}
              />
            ))}
          </View>
        ))}
        
      </ScrollView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    
    homebackground:{
      backgroundColor: 'white',
      flex: 1,
    },

    
    iconstyle: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: 10,
      fontSize:60,
      color: '#AA00FF'
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      //marginBottom: 10,
      width: 100, // adjust the size of the icon container here
      height: 100,  
      
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      
    },

    //Styley for the search bar

    searchBarContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    searchBar: {
      backgroundColor: 'white',
      borderTopWidth: 0, // Remove the top border
      borderBottomWidth: 0, // Remove the bottom border
    },

    inputContainer: {
      backgroundColor: 'white',
      borderRadius: 50,
      width: '80%',
      borderColor: 'black',
      borderWidth: 1,
      borderBottomWidth: 1,
    },

    input: {
      fontSize: 16,
      color: 'black',
    },


    chooseText: {
      marginTop: 15,
      marginBottom: 10,
    },
  });

  export default ScollView;