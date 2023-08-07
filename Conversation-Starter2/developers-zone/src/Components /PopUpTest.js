import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import PremiumScreenPopUp from './PremiumScreenPopUp';
import OccasionIcons from '../utils/OccasionIcons';


const PopUpTest = () => {
  const [showPopup, setShowPopup] = useState(false);
  const imageSource = '/Users/lorisgaller/Desktop/Github/Conversation-Starter2/developers-zone/src/assets/Occasions/public-transport.png';

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Toggle Popup" onPress={togglePopup} />
      <OccasionIcons title={'Public Transport'} />  
      {showPopup && <PremiumScreenPopUp onClose={togglePopup} />}

      

      

    </View>
  );
};

export default PopUpTest;