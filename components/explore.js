import state from "../global"
import React from 'react';
import chunkDB, {distanceBetween} from './chunkDB';
import structures from './structures';
import { addPopup, closePopup } from './PopupHandler';
import { Text, Button } from 'react-native-elements';
import { ItemSetDisplay } from './ItemUI';
import inventory from './inventory'
import exp from './exp';
import placeChooser from './placeChooser';

// This file contains stuff to do with whenever you move about on the map.
// only required by location.js

const explore = (lat,lng) => { 
    // run whenever you've moved ~20m from last time it ran
    // adds an array [lat,lng] to appropriate chunk's :explored: thingie if not explored this place
    // and decides if a structure/building should be generated there.
    var key = chunkDB.getKeyFromLocation(lat,lng)
    // Part 1: ADDING PLACE TO EXPLORED LIST
    if(key != state.locationChunk.key) console.error(state.locationChunk)
    // check if this place has already been explored
    for(var exploredplace of state.locationChunk.explored){
        if(distanceBetween(lat,lng,exploredplace.lat,exploredplace.lng) < 20){
            // something too close, let's not do this!
            // return that place that's too close, so we can check that we are further away than that
            // before trying to add again.
            return [exploredplace.lat,exploredplace.lng]
        }
    }
    // not explored, so add this latlng
    chunkDB.modifyLocationChunk(()=>{
        state.locationChunk.explored.push({lat:lat,lng:lng})
    })
    // give me some EXP for exploring
    exp.addExp(1);
    // Part 2 : CHECKING IF AND ADDING A BUILDING
    for(var building of state.locationChunk.buildings){
        // we have to be 200m from closest other building to build a new building.
        if(distanceBetween(lat,lng,building.lat,building.lng) < 170){
            return ([lat,lng])
        }
    }
    // building building
    chunkDB.modifyLocationChunk(()=>{
        let name = placeChooser()
        state.locationChunk.buildings.push({
            name: name,
            lastCollected: Date.now(),
            lat:lat,
            lng:lng,
        })
        getResources(name)
    })
    // found building: give me some more exp
    exp.addExp(4)
    return ([lat,lng]);
}
const getResources = (buildingName) =>{
    // must be 5 minutes since last collected resources
    var itemset = structures[buildingName].collectProduce()
    // add items to inventory
    inventory.addItems(itemset);
    exp.addExp(3)
    // display a popup saying you got some items
    addPopup(<>
        <Text h2>Collected Items!</Text>
        <ItemSetDisplay items={itemset}></ItemSetDisplay>
        <Text>Collected from the {structures[state.nearbyBuilding.name].displayName}</Text>
        <Button title="Close" onPress={closePopup}></Button>
    </>)
}
// Function run to collect building resources
const tryCollectBuildingResources = ()=>{
// checks if any resources avaliable at nearby building
if(state.nearbyBuilding != null)
    if((Date.now() - state.nearbyBuilding.lastCollected)/(60*1000) > 5){
        getResources(state.nearbyBuilding.name)
        //reset building timer
        chunkDB.modifyLocationChunk(()=>{
            state.nearbyBuilding.lastCollected = Date.now();
        })
    }
}
export {explore,tryCollectBuildingResources}