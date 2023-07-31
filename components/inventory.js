import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import items from "./items"
import state from '../global'

export default inventory = {
    addItem(item,count){
        if(state.inventory[item] == undefined || state.inventory[item] == null)
            state.inventory[item] = count;
        else 
            state.inventory[item] += count
        this.store();
    },
    countItem(item){
        // returns number of item
        if(state.inventory[item] == undefined || state.inventory[item] == null)
            return 0;
        return (state.inventory[item])
    },
    removeItem(item,count){
        // removes number of items, returns false if can't
        if(state.inventory[item] == undefined || state.inventory[item] == null){
            return false;
        }
        if(state.inventory[item] < count){
            delete state.inventory[item]
            return false;
        } 
        state.inventory[item]-= count;
        if(state.inventory[item] == 0) delete state.inventory[item];// remove all from inventory
        this.store();
    },
    store(){
        AsyncStorage.setItem("inventory",JSON.stringify(state.inventory))
    },
    has(inventorySubset){
        for(var i in inventorySubset){
            if(state.inventory[i] == undefined || state.inventory[i] < inventorySubset[i])
                return false;
        }
        return true;
    },
    removeItems(inventorySubset){
        // returns true if possible, false if not enough
        // MUST CHECK IF ENOUGH RESOURCES FIRST!
        for(var i in inventorySubset){
            state.inventory[i] -= inventorySubset[i]
            if(state.inventory[i] == 0) delete state.inventory[i]; 
        }
        this.store();
    },
    addItems(inventorySubset){
        for(var i in inventorySubset){
            if (state.inventory[i] == undefined) 
                state.inventory[i] = inventorySubset[i]
            else
                state.inventory[i] += inventorySubset[i]
        }
        this.store();
    },
    
    craft(item,multiplier){
        // adds the correct number of items to your inventory
        // does not remove required resources from your inventory first!
        this.addItem(item,items[item].crafting.produces * multiplier);
        this.store();
    }
}
// load inventory to state
AsyncStorage.getItem("inventory").then(data=>{
    state.inventory = JSON.parse(data);
    if(state.inventory == null || state.inventory == undefined) {
        state.inventory = {};
    }
}).catch(error=>{
    console.error("error in getting inventory " + error);
    state.inventory = {}// error could be due to no json data set.
})