import * as React from 'react';
import {View, Alert} from 'react-native'
import {Button, Avatar, Badge, Text,ListItem} from 'react-native-elements'
import { view } from "@risingstack/react-easy-state";
import items from './items'
import { addPopup,getTopItem, closePopup } from './PopupHandler';
import pending from './pending'
import inventory from './inventory'


//////////////////////////////DISPLAY 1 ITEM ///////////////////////////////////

const ItemDisplay= view((props)=>{
    return(
        <View style={{padding:12}}>
            <Avatar 
            onPress={()=>{addItemPopup(props.item)}}
            source={items[props.item].image}>
            </Avatar>
            <Badge
                status="primary"
                containerStyle={{ position: 'absolute', top:0, left: 0 }}
                value={props.count}
            />
        </View>
    )
})

///////////////////////////// DISPLAY MULTIPLE ITEMS /////////////////////////////
const ItemSetDisplay= view((props)=>{
    // displays a set of items
    var items= [];
    for(let i in props.items){
        items.push(<ItemDisplay key={i} item={i} count={props.items[i]}></ItemDisplay>);
      }
    return(
        <View style={{...props.style,...{flexDirection:"row",flexWrap:"wrap"}}}>
            {items}
        </View>
    )
})
/////////////////////////////////// DISPLAY LIST OF ITEMS - inventory screen/////////////
const ItemListItem= view((props)=>{
    return(
        <ListItem
            bottomDivider 
            leftAvatar={{source:items[props.item].image}}
            badge={{ value: props.count}}
            title={items[props.item].name} 
            onPress={()=>{addItemPopup(props.item)}}
            />
    )
})
const ItemSetList = view((props)=>{
    // displays a set of items
    var itemL= [];
    for(let i in props.items){
        itemL.push(<ItemListItem key={i} item={i} count={props.items[i]}></ItemListItem>);
      }
    return(
        <View>
            {itemL}
        </View>
    )
})
////////////////////////////////// ITEM INFO BOX ////////////////////////////////////////

// Helper function people use to add the item popup
const addItemPopup = (item) =>{
    var top = getTopItem()
    if(top != undefined)
        if(top.props.item == item)
            return; // if you're already showing the item popup for this, you don't have to show it again!

    addPopup(
        <ItemPopup item={item}></ItemPopup>
    )
}

// main component
const ItemPopup = (props) =>{
    const [multiplier,setMultiplier] = React.useState(1)
    var craftRecipie = items[props.item].crafting;
    if(typeof craftRecipie === 'string'){ // if you dont craft it, but find it
        return(
            <>
                <Text h2>{items[props.item].name}</Text>
                <ItemDisplay item={props.item} count={1}></ItemDisplay>
                <Text>{craftRecipie}</Text>
            </>
        )
    }
    // figure how much items will be produced with this craft
    var itemCount = craftRecipie.produces * multiplier;
    // figure out how many items will be required
    var requiredItems = {};
    for(var i in craftRecipie.required){
        requiredItems[i] = craftRecipie.required[i] * multiplier;
    }
    const hasRequiredItems = inventory.has(requiredItems);
    // crafting function
    const craft = ()=>{
        if(hasRequiredItems){
            // close the inventory popup - needs to be done first as pending.add might show a new popup
            closePopup()
            // add to pending
            pending.add({
                type:"craft",
                item:props.item,
                count:items[props.item].crafting.produces * multiplier,
                cost: requiredItems,
            })
            
        } else
            Alert.alert("You don't have the items for this, sorry!")
    }
    return(
    <>
        <Text h2>{items[props.item].name}</Text>
        <ItemDisplay item={props.item} count={itemCount}></ItemDisplay>

        <Text>{items[props.item].crafting.message}</Text>

        <Text>Crafting Requirements:</Text>
        <ItemSetDisplay items={requiredItems}></ItemSetDisplay>


        {items[props.item].crafting.buildingType == "any" ? undefined :
        <Text>At a Tier {items[props.item].crafting.minTier} {items[props.item].crafting.buildingType}</Text>
        }
        

        <View // my numeric upd-down input component
            style={{flexDirection:"row",justifyContent:"center",alignItems:"center",padding:8}}>
            <Button title="-" disabled={multiplier==1} onPress={()=>{multiplier > 1 ? setMultiplier(multiplier-1): 0;}} />
            <Text>{multiplier}</Text>
            <Button title="+" onPress={()=>{multiplier < 1000 ? setMultiplier(multiplier+1): 0;}} disabled={!hasRequiredItems} />
        </View>
        <Button title="Craft!" onPress={craft} disabled={!hasRequiredItems}></Button>
        <Text></Text>
    </>
    )
}
export {ItemDisplay,ItemSetDisplay,ItemSetList,ItemPopup,addItemPopup}