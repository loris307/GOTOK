import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const OccasionIcons = ({ title }) => {
  let imageSource;

  switch (title) {
    case 'Public Transport':
      imageSource = require('.././assets/Occasions/public-transport.png');
      break;
    case 'Social':
      imageSource = require('.././assets/Occasions/social-media.png');
      break;
    case 'Dating App':
      imageSource= require('.././assets/Occasions/dating-app.png');
      break;
    case 'Party':
      imageSource = require('.././assets/Occasions/party.png');
      break;
    case 'Restaurant':
      imageSource = require('.././assets/Occasions/restaurant.png');
      break;
    case 'Bar':
      imageSource = require('.././assets/Occasions/bar.png');
      break;
    case 'Café':
      imageSource = require('.././assets/Occasions/coffee-shop.png');
      break;
    case 'Grocery':
      imageSource = require('.././assets/Occasions/grocery.png');
      break;
    case 'Park':
      imageSource= require('.././assets/Occasions/park.png');
      break;
    case 'Public Transport':
      imageSource = require('.././assets/Occasions/public-transport.png');
      break;
    case 'Beach':
      imageSource = require('.././assets/Occasions/beach.png');  
      break;
    case 'Gym': //-----> AB HIERR NEU
      imageSource = require('.././assets/Occasions/gym.png');
      break;
    case 'Bus Station':
      imageSource = require('.././assets/Occasions/bus-station.png');
      break;
    case 'Cinema':
      imageSource = require('.././assets/Occasions/Cinema.png');
      break;
    case 'Comedy Show':
      imageSource = require('.././assets/Occasions/Comedy-Show.png');
      break;
    case 'Concert':
      imageSource = require('.././assets/Occasions/Concert.png');
      break;
    case 'Elevator':
      imageSource = require('.././assets/Occasions/elevator.png');
      break;
    case 'Exhibition':
      imageSource = require('.././assets/Occasions/exhibition.png');
      break;
    case 'Festival':
      imageSource = require('.././assets/Occasions/festival.png');
      break;
    case 'Hair Salon':
      imageSource = require('.././assets/Occasions/hair-salon.png');
      break;
    case 'Holiday Resort':
      imageSource = require('.././assets/Occasions/holiday-resort.png');
      break;
    case 'Library':
      imageSource = require('.././assets/Occasions/library.png');
      break;
    case 'Museum':
      imageSource = require('.././assets/Occasions/museum.png');
      break;
    case 'School':
      imageSource = require('.././assets/Occasions/School.png');
      break;
    case 'Sport Event':
      imageSource = require('.././assets/Occasions/sport-event.png');
      break;
    case 'University':
      imageSource = require('.././assets/Occasions/university.png');
      break;
    case 'Wedding':
      imageSource = require('.././assets/Occasions/wedding.png');
      break;
    case 'Wellness Center':
      imageSource = require('.././assets/Occasions/Wellness-Center.png');
      break;

    default:
      imageSource = require('developers-zone/src/assets/logoGoTok.png');
      break;
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={imageSource} />
      <Text style={styles.title}> { title } </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 128,
    borderWidth: 1,
    borderColor: 'black',
    shadowColor: '#B623A3',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 16,
    padding: 9,
    backgroundColor: 'white',
    marginBottom: 5,
    elevation: 15,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: '20%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 15,
  },
});

export default OccasionIcons;