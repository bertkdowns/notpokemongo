import * as React from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import state from "../global"
import inventory from "../components/inventory"
import { view } from '@risingstack/react-easy-state';
import {ItemSetDisplay, ItemSetList} from '../components/ItemUI';
import Icon from 'react-native-vector-icons/Feather';
import {Text,Button,Divider} from 'react-native-elements'
import {gstyles} from '../theme';
/*
Inventory Screen
Shows the resources the player has, and maybe player stats (maybe pets), accessories,
and other player stuff and rewards and things the game gives you as you play. equipables.
clothes. unlock different character apperances? different poses?
(maybe medals/trophies, or that might be in achievements)

*/

export default  InventoryScreen = view ((props)=>{
  const [listView,setListView] = React.useState(false);
  return(
    <ScrollView style={gstyles.screenScrollView}
      contentInsetAdjustmentBehavior="automatic"
      ><View style={gstyles.screen}>
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <Text h2>Inventory</Text>
        <Button title="" icon={<Icon
          name={listView?"grid":"list"}
          size={30}
        /> } type="clear" onPress={()=>{setListView(!listView)}}></Button>
        </View>
        <Text>Your Items:</Text>
        <Divider></Divider>
      {
        listView ?
          <ItemSetList items={state.inventory}></ItemSetList>
          :
          <ItemSetDisplay items={state.inventory}></ItemSetDisplay>
      }
      <Divider></Divider>
      <Button onPress={()=>inventory.addItem("wood",10)} title="GIVE me wood"></Button>
      </View></ScrollView>
  )
})