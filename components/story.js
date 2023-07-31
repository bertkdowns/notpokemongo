import * as React from 'react';
import {Text} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

export default story = [
    <>
<Text>Welcome, Stranger! You have a lot of work to do. You will build an empire, a great empire, from the ground up. The goal of your empire is simple: Craft the Ark Stone. The Ark Stone resonates with energy and beauty, and can be used to fuel the utopia your citizens will deserve.</Text>
<Text></Text>
<Text>This game is designed to help you have fun as you get outside and explore your community. It provides you with a unique challenge, as you have no map but the map of where you have gone. Build up your civilization one bit at a time, by collecting items and upgrading locations. But remember, this is about having fun! With inspiration from games like Minecraft and Civilization, we want you to try and build and expand your empire in your own unique way.</Text>
    </>
]

// when we got to a new tier of buildings, more of the story is revealed.
const foundTier = (tier) =>{
    if(state.tierReached < tier){
        state.tierReached = tier
        AsyncStorage.setItem("tierReached",tier.toString())
    }
}
AsyncStorage.getItem("tierReached").then(data=>{
    state.tierReached = parseInt(data);
    if(state.tierReached == null || state.tierReached == undefined) {// if no json data set
        state.tierReached = 1;
    }
}).catch(error=>{
    console.error("error getting tierReached data story.js " + error);
    state.tierReached = 1// error could be due to no json data set.
})
export {foundTier};