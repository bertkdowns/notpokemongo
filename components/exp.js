import * as React from 'react';
import { addPopup, closePopup } from './PopupHandler';
import { Text, Button } from 'react-native-elements';
import state from '../global'
import AsyncStorage from '@react-native-community/async-storage';

export default exp = {
    addExp(amount){
        var prevLevel = this.getLevel()
        state.exp += amount;
        this.store();
        if(prevLevel < this.getLevel()){
            addPopup(<>
                <Text h2>Leveled Up!</Text>
                <Text>Reached level {this.getLevel()}</Text>
                <Button onPress={closePopup} title="Yay!"></Button>
            </>)
        }
    },
    getLevel(){
        return Math.ceil(state.exp/100)
    },
    requiredToComplete(level){
        return level * 100;
    },
    store(){
        AsyncStorage.setItem("exp",state.exp.toString())
    }
}

AsyncStorage.getItem("exp").then(data=>{
    if(data == null || data == undefined) {// if no json data set
        state.exp = 1;
    } else
        state.exp = parseInt(data);
    
}).catch(error=>{
    console.error("error getting exp " + error);
    missions.exploredUnits = 0;// error could be due to no json data set.
})
