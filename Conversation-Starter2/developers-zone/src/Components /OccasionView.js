import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback, DeviceEventEmitter} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Header from '../utils/header.js';
import OccasionIcons from 'developers-zone/src/utils/OccasionIcons.js'; 
import i18n from '../../i18n.js';
//import mobileAds from 'react-native-google-mobile-ads';
//import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';




const IconWrapper = ({ title, navigation, searchQuery }) => {
  const handleIconClick = (clickedIcon) => {
    let iconToPass = clickedIcon === 'Your Choice' ? searchQuery : clickedIcon;
    navigation.navigate('ConversationStarterPrem', { title: iconToPass });
  };

  return (
    <TouchableOpacity style={styles.iconWrapper} onPress={() => handleIconClick(title)}>
      <OccasionIcons title={title} onClick={handleIconClick} />
    </TouchableOpacity>
  );
};

const OccasionView = ({ navigation }) => {
  const icons = ['Social', 'Dating App', 'Party', 'Restaurant', 'Bar', 'Café', 'Grocery', 'Park', 'Public Transport', 'Beach', 'Gym', 'Bus Station', 'Cinema', 'Comedy Show','Concert','Elevator','Exhibition','Festival','Hair Salon','Holiday Resort','Library','Museum','School','Sport Event', 'University', 'Wedding','Wellness Center']; // Array of icons -> this determines the order of the icons
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIcons, setFilteredIcons] = useState(icons);

  //const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';


  useEffect(() => {
    const languageChangeListener = DeviceEventEmitter.addListener('languageChange', () => {
      navigation.setParams({});  // forceUpdate equivalent in functional components
    });

    return () => {
      if (languageChangeListener) {
        languageChangeListener.remove(); // remove the listener when the component unmounts
      }
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    let filteredIcons = icons.filter((icon) =>
      icon.toLowerCase().includes(query.toLowerCase())
    );
    // If the searched icon is not found, add a "Your Choice" option
    if (filteredIcons.length === 0) {
      filteredIcons.push('Your Choice');
    }
    setFilteredIcons(filteredIcons);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.homebackground}>
        <Header title={i18n.t("titleOccasion")}  />
        <ScrollView style={styles.homebackground}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              containerStyle={styles.searchBar}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              placeholder={i18n.t("inputPlaceholder")}
              onChangeText={handleSearch}
              value={searchQuery}
            />
            <Text style={styles.chooseText}>{i18n.t("chooseLabel")}</Text>
          </View>
          <View style={styles.iconContainer}>
            {filteredIcons.map((icon, iconIndex) => (
              <IconWrapper key={iconIndex} navigation={navigation} title={icon} searchQuery={searchQuery} /> // Pass the title prop to IconWrapper
            ))}
          </View>
          {/* <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          /> */}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  homebackground: {
    backgroundColor: 'white',
    flex: 1,
    
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchBarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 20,
  },

  iconWrapper: {
    flexBasis: '30%', // Each icon will take up 30% of the row's width
    margin: '1.5%',   // This will ensure that the icons maintain even spacing
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

export default OccasionView;