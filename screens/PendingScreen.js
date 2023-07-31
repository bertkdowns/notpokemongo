import * as React from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import state from '../global'
import pending from '../components/pending'
import { view } from '@risingstack/react-easy-state';
import { Card, Button, Text } from 'react-native-elements';
import items from '../components/items';
import { ItemSetDisplay } from '../components/ItemUI';
import structures from '../components/structures';
import {gstyles} from '../theme';

/*
Pending actions screen
When you decide to build stuff, this screen shows all the pending changes
You then have to run to those places to do apply the changes - there will be some kind of indication
on the map of what ones you need to visit too.
this screen also allows you to cancel those trips if you want to use the resources for something else
// "Pending Actions" items have a reference to a building and resources required and function to be run if meets resource requirements.
*/

export default PendingScreen =view ((props)=>{
    
  return(
    <ScrollView style={gstyles.screenScrollView}
      contentInsetAdjustmentBehavior="automatic"
      ><View style={gstyles.screen}>
      <Text h1>Pending Actions</Text>
      {state.pending.map((u,i)=>{
        return <PendingCard key={i} object={u} index={i}></PendingCard>
      })}
    </View></ScrollView>
  )
})

const PendingCard = view((props)=>{
  const remove = ()=>{
    pending.remove(props.index);
  }
  const closeButton = <Button containerStyle={{position:"absolute",top:-5,right:0}} title="X" type="clear" onPress={remove}></Button>
  switch (props.object.type){
    case "craft":
      var itemInfo =  items[props.object.item]
      return (<Card
      title={"Craft " + props.object.count + " " + itemInfo.name}
      >
        <Text>Cost:</Text>
        <ItemSetDisplay items={props.object.cost}></ItemSetDisplay>
        <Text>Required building: {itemInfo.crafting.buildingType} (Tier {itemInfo.crafting.minTier} or higher)</Text>
        {closeButton}
      </Card>)
    break;
    case "upgrade":
      return (<Card title="Upgrade Building">
        <Text>To: {structures[props.object.upgradeTo].displayName}</Text>
        <Text>Cost:</Text>
        <ItemSetDisplay items={props.object.cost}></ItemSetDisplay>
        {closeButton}
      </Card>)
    break;
    case "special": 
      if(props.object.buildingName == undefined) console.error("You need to give special actions the buildingName for PendingScreen")
      var specialInfo = structures[props.object.buildingName].special[props.object.action]
      return (<Card title={"Special Action - " + specialInfo.displayName}>
        <Text>{specialInfo.description}</Text>
      <Text>To use at {structures[props.object.buildingName].displayName}</Text>
        <Text h4>Cost:</Text>
        <ItemSetDisplay items={props.object.cost}></ItemSetDisplay>
        {closeButton}
      </Card>)
    break;
  }

})
