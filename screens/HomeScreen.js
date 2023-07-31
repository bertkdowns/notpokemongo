import * as React from 'react';
import { View, StyleSheet, ScrollView,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import state from '../global';
import chunkDB, { distanceBetween } from '../components/chunkDB'
import inventory from '../components/inventory'
import pending from '../components/pending'
import { view } from '@risingstack/react-easy-state';
import {theme,gstyles} from '../theme'
import structures from '../components/structures';
import { ItemSetDisplay } from '../components/ItemUI';
import {Button, Divider, Text, Badge, Avatar,Card, colors, Overlay,Image} from 'react-native-elements'
import MapboxGL from "@react-native-mapbox-gl/maps";
import circleToPolygon from "circle-to-polygon"
MapboxGL.setAccessToken(null);
MapboxGL.setConnected(true);
/* 
Main app screen
Holds the map with all the locations you can click on
my thinking:
naturally generated structures are generated at least a certain distance apart
man made structures can be placed with higher density or something, because there might
be more of them
you explore the map as you go, rather than using a preexisting map.
means it wil work in the bush/ farms etc
as you run there is a chance to find/encounter different objects, loot, pets and things
(higher in unexplored areas though, because otherwise theres less to do there)

other ideas:
story elements each day on logon? things happen, you have to do something about them,
your choices affect the future of your civilization/ or your resources, or something
- probably not gonna do this, as people likely want control themselves.

would be nice to add indicators showing good places you could go - a little green dot, orange, red etc
*/

const locationIcon = require("../assets/mylocation.png")
const tilesetImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAj0AAAI9AEpSnbNAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAyJJREFUeJzt1DERwCAAwMBS/wK4wyY7yGDIv4JMGWvP8wFJ/+sA4B0DgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgDADgLALGCgFJld4Qy8AAAAASUVORK5CYII=";
var foundLocation = false;
var mapCamera;
var selectedBuilding;
var setSelectedBuilding
export default HomeScreen  = view((props)=>{
  const [selBuilding,setSelBuilding] = React.useState(null);
  selectedBuilding = selBuilding
  setSelectedBuilding = setSelBuilding;
  var selTodoAction = false;// check if we can do action craft or collect items from the selected building
  var selCanCraft = false;
  var selCanCollect = false;
  
  
  // map updates, onregionchange
  const panToLocation = () =>{
    if(mapCamera != undefined)
      mapCamera.flyTo([state.location.lng,state.location.lat],500)
  }

  // get the chunks from the database for whatever the current region is on the screen
  const onRegionChange = (e) =>{
    // e.properties.visiblebounds is an array with [[lng,lat],[lng,lat]] of coordinates [ne,sw] visible in users viewport
    chunkDB.getChunks(e.properties.visibleBounds[0][1],e.properties.visibleBounds[0][0],e.properties.visibleBounds[1][1],e.properties.visibleBounds[1][0]);
  }

  /* /// apparently this library doesn't like this code right now.
  //if(!foundLocation && state.location.lat != 0 && state.location.lng != 0 && mapCamera != undefined){
  //  //when we open the app and the user's location is first figured out, pan to that location
  //  panToLocation()
  //  foundLocation = true;
  //}
  */

  // display all the circles on the map from all the chunks
  let exploredPlaces = {
    type:"FeatureCollection",
    features:[
    ]
  
  }
  for(var chunk in state.chunks){
    for(var area of state.chunks[chunk].explored){
      exploredPlaces.features.push({
        type: "Feature",
        properties: {},
        geometry: circleToPolygon([area.lng,area.lat],20,6)
      })
    }
  }
  //////////////////////////////DISPLAYING BUILDINGS!////////////////////////////////
  // for the badges: iterate through pending items and sort into crafts types/tiers and individual upgrades/specials
  var placesToCraft = {}// format: object with properties type:tier e.g mechanical:5
  var placesToVisit = []; // all the pending items that have a specific place you need to visit (upgrade + special type)
  for(var pending of state.pending){
    if(pending.type == "craft"){
      var craftRecipie = items[pending.item].crafting
      if(placesToCraft[craftRecipie.buildingType] == undefined){
        placesToCraft[craftRecipie.buildingType] = craftRecipie.minTier
      } else if(placesToCraft[craftRecipie.buildingType] > craftRecipie.minTier){
        // if one item requires tier 5 and one item requires tier 4, we know we can craft at any building above tier 4
        placesToCraft[craftRecipie.buildingType] = craftRecipie.minTier
      }
    } else if(pending.type == "upgrade" || pending.type == "special"){
      placesToVisit.push(pending);
    }
  } 
  // display all the buildings on the map
  var structureArray = [];
  for(var chunk in state.chunks){
    // make an array of pending for this chunk
    var pendingInThisChunk = [];
    for(var i = placesToVisit.length -1; i >= 0; i--){
      if(chunkDB.getKeyFromLocation(placesToVisit[i].lat,placesToVisit[i].lng) == chunk){
        // this is a pending item we have to consider in this chunk
        pendingInThisChunk.push(placesToVisit[i])
        // remove it from placesToVisit so less comparisons next time
        placesToVisit.splice(i,1);
      }
    }
    for(var building of state.chunks[chunk].buildings){
      // badge should show if: items to be collected (green) crafting to be done (blue) upgrade/special action to be done (red)
      // check if this is one of the places to visit PendingInThisChunk
      var todoActionHere = false;
      var canCraftHere = false;
      var canCollectItemsHere = false;
      if(pendingInThisChunk.some((el,index)=>{
        if(el.lat == building.lat && el.lng == building.lng){
          // there is something at this building that needs to be done.
          // return true, but also remove this from the array so less comparisons next building.
          pendingInThisChunk.splice(index,1)
          return true;
        }
        return false
      })) todoActionHere = true;
      // should we visit here for crafting purporses? (is type in placesToCraft and tier greater than that too?)
      if(placesToCraft[structures[building.name].type] != undefined && placesToCraft[structures[building.name].type] <= structures[building.name].tier){
        canCraftHere = true;
      }
      if((Date.now() - building.lastCollected)/(60*1000) > 10)
        // it's been 10 minutes since this building was visited, we can pick up some items here
        canCollectItemsHere = true;
      if(building == selectedBuilding){
        selTodoAction = todoActionHere;
        selCanCraft = canCraftHere;
        selCanCollect = canCollectItemsHere;
      }
      structureArray.push(
      <MapboxGL.MarkerView key={building.name + building.lat + building.lng} coordinate={[ building.lng,building.lat]} id={building.name + building.lat}>
        <View style={{width:48,height:48,backgroundColor:"rgba(255,255,255,0.002);"}}>
          
          <BuildingMarkerIcon building={building}></BuildingMarkerIcon>
          {(canCollectItemsHere || canCraftHere || todoActionHere) ? // display badge if something to do here
            <Badge
                status={todoActionHere ? "error" : canCraftHere ? "warning" : "primary"}
                containerStyle={{ position: 'absolute', top:0, left: 0 }}
                value={1}
            />
          : undefined
        }
        </View>
      </MapboxGL.MarkerView>)
    }
  }
  
  
  /////////////////////////////////////// MODAL POPUP SELECTED BUILDING STUFF///////////////////////////////////
  // set the modal to show the information correctly
  if(selectedBuilding != null){
    // structureData stores the general information about that structure like crafting recipies etc
    var structureData = structures[selectedBuilding.name]
    // selectedBuilding contains the information about this partacular instance of a structure.
    var minSinceBuildingVisited = (Date.now() - selectedBuilding.lastCollected)/(60*1000)
    var buildingUpgrages = [];
    var distanceToSelected = distanceBetween(selectedBuilding.lat,selectedBuilding.lng,state.location.lat,state.location.lng)
    for(let i in structureData.convertTo){
      buildingUpgrages.push(
        <UpgradeUI key={i} convertTo={i} cost={structureData.convertTo[i]} disabled={selTodoAction}></UpgradeUI>
      )
    }
    
    var specialActions = [];
    for(let i in structureData.special){
      specialActions.push(
        <SpecialActionUI key={i} name={i} specialAbility={structureData.special[i]}></SpecialActionUI>
      )
    }
  }
  


  return(
    <View style={{flex:1}}>
      <View style={styles.mapContainer}>
      <MapboxGL.MapView style={{flex:1}} styleURL="" onRegionDidChange={onRegionChange}>
        <MapboxGL.Camera ref={r=>{mapCamera=r;}} centerCoordinate={[175.2029,-37.9890]} zoomLevel={16}></MapboxGL.Camera>
        <MapboxGL.ShapeSource id="exploredSource" shape={exploredPlaces}>
          <MapboxGL.FillLayer
            id="exploredFill"
            style={{fillColor:'#0C6',fillOutlineColor:'#0C6'}}
          />
        </MapboxGL.ShapeSource>
        {structureArray}

        <MapboxGL.MarkerView coordinate={[ state.location.lng,state.location.lat]} id="yourLocation">
          <View style={{width:32,height:32,backgroundColor:'rgba(0,204,102,0.1)'}}>
            <Avatar source={locationIcon} size={32}></Avatar>
          </View>
        </MapboxGL.MarkerView>
        
      </MapboxGL.MapView>
      </View>

      <View style={{position: "absolute", top: 10, right:10,}}>
      <Icon.Button name="disc" style={{backgroundColor:"white",textAlign:"center"}} color="dodgerblue" onPress={panToLocation}
      />
      </View>
      
      

      <Overlay // the popup that I hope will popup
      
      animationType="fade"
      transparent={true}
      isVisible={selectedBuilding != null}
      onRequestClose={() => {setSelectedBuilding(null)}}
      >
        <ScrollView>
        {structureData == null ? <Text>No building selected</Text>:
        <>
          <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
          <Text h2 style={{flexShrink:1}}>{structureData.displayName}</Text>
          <Avatar source={structureData.image} size="large"></Avatar>
          </View>
          <Text>Tier {structureData.tier} {structureData.type} - {Math.round(distanceToSelected)} m away.</Text>
          <Divider style={{margin:10}}></Divider>
          {selTodoAction 
            ?
            <View style={{flexDirection:"row",alignItems:"center"}}><Badge status="error"/><Text> Pending Actions here!</Text></View>
            : undefined
          }
          {selCanCraft 
            ? 
            <View style={{flexDirection:"row",alignItems:"center"}}><Badge status="warn"/><Text> Pending crafts you can complete here!</Text></View>
            : undefined
          }
          { (minSinceBuildingVisited < 10)
            ?  <Text>{parseInt(10- minSinceBuildingVisited)} minutes until you can collect more resources from here.</Text> 
            : <View style={{flexDirection:"row",alignItems:"center"}}><Badge status="primary" /><Text> Resources avaliable here!</Text></View>
          }
          <Divider style={{margin:10}}></Divider>
          <Text> {structureData.description}</Text>
          
          {specialActions.length != 0 ? <>
            <Text></Text>
            <Text h3 style={{textAlign:"center"}}>Actions</Text>
            {specialActions}
            </>
            : undefined}
          <Text></Text>
          <Text h3 style={{textAlign:"center"}}>Upgrades</Text>
          {buildingUpgrages}
          
        </>
        }
        </ScrollView>
      </Overlay>
    </View>
  )
});





const BuildingMarkerIcon = (props) =>{
  return (
    <Avatar onPress={()=>{setSelectedBuilding(props.building)}}
      source={structures[props.building.name].image}
      size={48}// if you change this, you also have to change the size of the enclosing View, or the icon might get cut off.
    ></Avatar>
  )
}





// very similar to onUpgradePress function
// handles pending or immediate action of Special functions.
const onSpecialPress = (ability)=>{
  // check if you can afford it
  var structureData = structures[selectedBuilding.name]
  if(inventory.has(structureData.special[ability].cost)){
    // otherwise add it to pending to be done later
    pending.add({
      cost:structureData.special[ability].cost,
      type:"special",
      action:ability,
      buildingName:selectedBuilding.name,
      lat:selectedBuilding.lat,
      lng:selectedBuilding.lng,
    })
  } else{
    Alert.alert("Not Enough Items","You don't have enough items to pay for this right now")
  }
}
const SpecialActionUI = (props)=>{
  return (
  <Card title={props.specialAbility.displayName}>
    <Text >{props.specialAbility.description}</Text>
    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
    <ItemSetDisplay items={props.specialAbility.cost}></ItemSetDisplay>
    <Button title="Go" disabled={props.disabled} onPress={()=>{onSpecialPress(props.name)}}></Button>
    </View>
  </Card>)
}






const onUpgradePress = (upgradeOption)=>{
  // upgrade building - either now or add a pending request.
  // first check if you can afford it though!
  var structureData = structures[selectedBuilding.name]
  if(inventory.has(structureData.convertTo[upgradeOption])){
    pending.add({
      cost:structureData.convertTo[upgradeOption],
      type:"upgrade",
      upgradeTo:upgradeOption,
      lat:selectedBuilding.lat,
      lng:selectedBuilding.lng,
    })
    
  } else{
    Alert.alert("Not Enough Items","You don't have enough items to pay for this right now")
  }
  
}
const UpgradeUI = (props) =>{
  return(
    <Card title={structures[props.convertTo].displayName}>
          <Text>Tier {structures[props.convertTo].tier} {structures[props.convertTo].type}</Text>
          <Text>{structures[props.convertTo].description}</Text>
          <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
          <ItemSetDisplay items={props.cost} style={{flex:1}}></ItemSetDisplay>
          <Button disabled={props.disabled} title="Upgrade" onPress={()=>{onUpgradePress(props.convertTo)}}></Button>
          </View>
        </Card>
  )
}



const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    flex:10,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
});