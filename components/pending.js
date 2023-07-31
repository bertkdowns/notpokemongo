import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import items from "./items"
import structures from './structures';
import Toast from 'react-native-simple-toast';
import { addPopup, closePopup } from './PopupHandler';
import { Text, Button } from 'react-native-elements';
import state from '../global'
import exp from './exp';
import {foundTier} from './story'
import chunkDB from './chunkDB';

export default pending = {
    tryCompleteAny(){
        // needs to be run any time nearbyBuilding changes
        if(state.nearbyBuilding == undefined) return;
        // we must go in reverse as items are removed from the array.
        for(var i = state.pending.length -1; i >= 0;i--){
            this.tryComplete(i)
        }
    },
    tryComplete(i){// tries and completes an item, returning true if it does complete it,false if it doesn't
        var structure = state.nearbyBuilding != undefined ?structures[state.nearbyBuilding.name] : undefined;
        let pending = state.pending[i];
        if(pending.type == "craft"){
            var craftRecipie = items[pending.item].crafting;
            if( craftRecipie.buildingType == "any" || (structure != undefined && craftRecipie.buildingType == structure.type && craftRecipie.minTier <= structure.tie) ){                // right building, craft the thing!
                inventory.addItem(pending.item,pending.count);
                var expP = Math.ceil(pending.count/5)
                exp.addExp(expP)
                addPopup(<>
                    <Text h2>Action Complete!</Text>
                    <Text>Crafted {pending.count} {items[pending.item].name}</Text>
                    <Text>+{expP} xp</Text>
                    <Button title="Close" onPress={closePopup}></Button>
                </>)
                this.complete(i);   
                return true;  
            }
        } else if(pending.type == "upgrade"){
            if(structure != undefined )
                if(pending.lat == state.nearbyBuilding.lat && pending.lng == state.nearbyBuilding.lng){
                    exp.addExp(10)
                    addPopup(<>
                        <Text h2>Action Complete!</Text>
                        <Text>Upgrade {structure.displayName} to {structures[pending.upgradeTo].displayName}</Text>
                        <Text>+10 xp</Text>
                        <Button title="Close" onPress={closePopup}></Button>
                    </>)
                    chunkDB.modifyLocationChunk(()=>{
                        state.nearbyBuilding.name = pending.upgradeTo;// make this the new building!!!
                    })
                    foundTier(structures[pending.upgradeTo].tier);
                    this.complete(i);
                    // have to clear any other ones for the building,
                    // because otherwise it might try upgrade twice or something rediculous.
                    this.clearPendingForBuilding(pending.lat,pending.lng);
                    return true;
                }
        } else if(pending.type == "special"){
            if(structure != undefined )
                if(pending.lat == state.nearbyBuilding.lat && pending.lng == state.nearbyBuilding.lng){
                    // also need pending.buildingName for the PendingScreen
                    var res = structure.special[pending.action].doAction();
                    exp.addExp(5)
                    addPopup(<>
                        <Text h2>Action Complete!</Text>
                        <Text>{structure.special[pending.action].displayName}</Text>
                        <Text>+5 xp</Text>
                        <Text>{res}</Text>
                        <Button title="Close" onPress={closePopup}></Button>
                    </>)
                    this.complete(i);
                    return true;
                }
        }
        return false;
    },
    add(pending){
        // remove the cost (pending.cost) from the inventory
        inventory.removeItems(pending.cost)
        state.pending.push(pending)
        // check if this thingie is already completable and if so complete it
        if(this.tryComplete(state.pending.length -1) == false)
            // apparently the Toast library sometimes has problems when it tries to render the toast on a modal that you then remove. Only on ios though, read the docs for the lib 
            Toast.show("Added to Pending Actions",Toast.SHORT)
        this.store();

    },
    complete(index){
        // complete is different from remove
        // complete deletes it from the list
        // remove gives you back your resources.   
        state.pending.splice(index,1);
        this.store();
    },
    remove(index){
        inventory.addItems(state.pending[index].cost)
        state.pending.splice(index,1)
        this.store();
    },
    clearPendingForBuilding(lat,lng){
        // if we change which building we have here, we cannot do any other things for that building, so we should run this function.
        for(var i = 0; i < state.pending.length;i++){
            let pending = state.pending[i];
            if((pending.type == "upgrade" || pending.type == "special") && pending.lat == lat && pending.lng == lng){
                this.remove(i);
                i--;
            }
        }
    },
    store(){
        AsyncStorage.setItem("pending",JSON.stringify(state.pending))
    },
}
AsyncStorage.getItem("pending").then(data=>{
    state.pending = JSON.parse(data);
    if(state.pending == null || state.pending == undefined) {// if no json data set
        state.pending = [];
    }
}).catch(error=>{
    console.error("error getting pending data global.js " + error);
    state.pending = []// error could be due to no json data set.
})