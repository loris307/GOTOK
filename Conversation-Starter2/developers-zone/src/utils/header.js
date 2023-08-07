import React from 'react';
import { View, Text } from 'react-native';
import Menu from './dropDownMenu';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title }) => {
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>
        
        <View style={styles.topBar}>
          <Menu navigation={navigation} />
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 24 }}></View>
        </View>
        
      </View>
    );
  };
  const styles = {
    container: {
      //position: 'fixed',
      
      zIndex: 1,
      height: 50,
      marginTop: 50,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      paddingHorizontal: 10,
    },
    
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },

    
  };

export default Header;