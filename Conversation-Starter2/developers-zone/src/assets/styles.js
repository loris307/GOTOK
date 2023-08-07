import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
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
      color: '#B623A3'
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
    ViewStyle:{
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle:{
      fontSize: 50,
      fontWeight: 800,
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






    heading: {
      fontSize: 20,
      fontWeight: 'bold',
    },

    //Styles for the top bar
    // topBar: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'space-between',
    //   height: 50,
    //   //paddingHorizontal: 10,
    //   backgroundColor: '#F5F5F5',
    // },

    searchIcon: {
      fontSize: 20,
    },

    chooseText: {
      marginTop: 15,
      marginBottom: 10,
    },

    
  });