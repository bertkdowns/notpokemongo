/**
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import {ThemeProvider} from "react-native-elements"

// screens
import HomeScreen from './screens/HomeScreen';
import PendingScreen from './screens/PendingScreen';
import CharacterScreen from './screens/CharacterScreen';
import InventoryScreen from './screens/InventoryScreen';

import {PopupHandler} from "./components/PopupHandler"
import Locator from './components/location'
import {theme} from './theme';
import { DBLoader } from './components/chunkDB';


const Tab = createBottomTabNavigator();

export default function App() { 
  return ( 
    <ThemeProvider theme={theme}>
    <View style={{flex:1}}>
      <DBLoader></DBLoader>
      {/*navigation stuff*/}
      <NavigationContainer>
        <Tab.Navigator
          tabBarOptions={{activeBackgroundColor:theme.colors.card,inactiveBackgroundColor:theme.colors.background2}}

          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = "map";
              if(route.name =="Home"){
                iconName ="map";// newspaper navigate person
              }else if(route.name =="Pending Actions"){
                iconName ="edit";// newspaper navigate person
              }if(route.name =="Character"){
                iconName ="user";// newspaper navigate person
              }if(route.name =="Inventory"){
                iconName ="briefcase";// newspaper navigate person
              }
              
              // You can return any component that you like here!
              return <Icon name={iconName} size={size} color={color} />
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen}  />
          <Tab.Screen name="Pending Actions" component={PendingScreen}  />
          <Tab.Screen name="Inventory" component={InventoryScreen}/>
          <Tab.Screen name="Character" component={CharacterScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <Locator></Locator>
      <PopupHandler></PopupHandler>
    </View>
    </ThemeProvider>
);};



