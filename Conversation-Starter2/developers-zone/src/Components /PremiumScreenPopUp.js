import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Text, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from '../../i18n.js';



const PremiumScreenPopUp = ({ onClose, navigation }) => {
  const [slideAnimation] = useState(new Animated.Value(Dimensions.get('window').height));

  useEffect(() => {
    openPopup();
    return () => {
      closePopup();
    };
  }, []);

  const openPopup = () => {
    Animated.timing(slideAnimation, {
      toValue: Dimensions.get('window').height - Dimensions.get('window').height * 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePopup = () => {
    Animated.timing(slideAnimation, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onClose) {
        onClose();
      }
    });
  };

  const slideAnimationStyle = {
    transform: [
      {
        translateY: slideAnimation,
      },
    ],
  };

  const renderTextsWithIcon = () => {
    const textsWithIcon = [
      { text: i18n.t("premTextAndIcons1"), iconName: 'star' },
      { text: i18n.t("premTextAndIcons2"), iconName: 'star' },
      { text: i18n.t("premTextAndIcons3"), iconName: 'star' },
      { text: i18n.t("premTextAndIcons4"), iconName: 'star' },
    ];

    return textsWithIcon.map((item, index) => (
      <View key={index} style={styles.textWithIconContainer}>
        <Icon name={item.iconName} style={styles.icon} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      
      <Animated.View style={[styles.popup, slideAnimationStyle]}>
        <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
            <Icon name="close" style={styles.closeIcon} />
        </TouchableOpacity>
        <Text style={styles.popupTitle}>{i18n.t("premPopUpH1")}</Text>
        <Text style={styles.popupText}>{i18n.t("premCTAText")}</Text>
        <Text style={styles.upgradeText}>{i18n.t("premPopUpCTAText")}</Text>
        
        <View style={styles.textIconContainer}>
            {renderTextsWithIcon()}
        </View>


        <View style={styles.btnContainer}>
         <TouchableOpacity onPress={() => {navigation.navigate('OccasionView')}} style={styles.buttonSub}>
            <Text style={styles.buttonTextSub}>{i18n.t("subscribeBtn")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('OccasionView')} style={styles.button}>
            <Text style={styles.buttonText}>{i18n.t("backhomeBtn")}</Text>
        </TouchableOpacity>
    </View>

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeIcon: {
    fontSize: 30,
    color: 'white',
  },
  popup: {
    height: '80%',
    width: '95%',
    backgroundColor: '#B623A3',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  popupTitle: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },

  popupText:{
    fontSize: 11,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },

  upgradeText:{
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,

  },
  
  //Text and Icons
  textIconContainer: {
    alignItems: 'flex-start',
    marginBottom: 40,
  },

  icon: {
    marginRight: 5,
    fontSize: 16,
    color: 'white',
  },

  text: {
    fontSize: 12,
    color: 'white',
  },

  textWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  //Buttons
  buttonSub: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
    width: '98%',
    marginBottom: 10,
  },
  button: {
    //backgroundColor: '#AA00FF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
    width: '98%',
    marginBottom: 10,
    backgroundColor: '#B623A3',
  },
  buttonTextSub: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  btnContainer: {
    alignItems: 'center',
    width: '100%',
  },
});

export default PremiumScreenPopUp;