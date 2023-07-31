import * as React from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import { view } from '@risingstack/react-easy-state';
import state from '../global'
import {Text, Button, Card,ThemeContext} from 'react-native-elements';
import exp from '../components/exp'
import {gstyles} from '../theme';
import story from '../components/story'
/*
Missions screen
This screen shows what missions the game thinks you should do next - probably a list of 
options so you can choose what one you want to do.
I want to draw some inspiration from minecraft and let the game get out of the way
and allow you to do whatever you want -as long as you run of course -
but missions will give you ideas of what you could build, upgrade, find, etc

below the missions I want to have achievements (completed missions) so people can see how much 
they have achieved, and maybe some game stats (kms travelled etc)
this might require a dynamic-loading scrollview or something.

*/


export default CharacterScreen = view ((props)=>{
  const { theme } = React.useContext(ThemeContext);
  const [tipToShow,setTip] = React.useState(Math.floor(Math.random()* basicTips.length));
  const [storyIndex, setStoryIndex] = React.useState((state.tierReached < story.length)?state.tierReached -1 : story.length - 1);
  state.exp;
  var level = exp.getLevel();
  var expToStart = exp.requiredToComplete(level -1)
  var expToFinish = exp.requiredToComplete(level)
  return(
    <ScrollView style={gstyles.screenScrollView}
      contentInsetAdjustmentBehavior="automatic"
      >
      <View style={gstyles.screen}>
      <Text h2>Character</Text>

      <View style={{alignItems:"center"}}>
        <Text>Level</Text>
        <Text style={{fontSize:60}}>{level}</Text>
        <ProgressBar color={theme.colors.primary} progress={(state.exp-expToStart)/(expToFinish-expToStart)}></ProgressBar>
        <Text>{state.exp}/{expToFinish}</Text>
        <Text>{message}</Text>
      </View>
      
      <Card>
      {story[storyIndex]}
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <Button title="<" type="clear" disabled={storyIndex==0} onPress={()=>{setStoryIndex(storyIndex-1)}}></Button>
        <Button title=">" type="clear" disabled={storyIndex==state.tierReached-1|| storyIndex==story.length-1} onPress={()=>{setStoryIndex(storyIndex+1)}}></Button>
        </View>
      </Card>

      <Card title="Tips">
      <Text>{basicTips[tipToShow]}</Text>
      <Button containerStyle={{position:"absolute",top:-5,right:0}} title=">" type="clear" onPress={()=>{setTip((tipToShow+1)%basicTips.length)}}></Button>
      <Button containerStyle={{position:"absolute",top:-5,left:0}} title="<" type="clear" onPress={()=>{setTip(tipToShow==0?basicTips.length -1 : tipToShow-1)}}></Button>
      </Card>
    </View>
    </ScrollView>
  )
})

const ProgressBar = (props)=>{
  const { theme } = React.useContext(ThemeContext);
  // props: progress (0-1), color
  return(
    <View style={{flexDirection:"row",borderColor:"black",borderWidth:1}}>
      <View style={{backgroundColor:props.color?props.color:theme.colors.primary,flex:props.progress,height:10}}></View>
      <View style={{flex:(1-props.progress),backgroundColor:theme.colors.card}}></View>
    </View>
  )
}

const basicTips=[
  "Walk around your local area to explore and find more structures.",
  "Tap on a place on the map to bring up its menu.",
  "You can tap on an item to get information about it, or to open its crafting menu.",
  "The inventory screen shows you all the items you have in your inventory right now.",
  "You can manage and remove pending actions on the pending actions screen. You get your resources back if you cancel an action.",
  "You can gain experience by upgrading structures, exploring, and collecting and crafing items.",
  "Visit locations every 10 minutes to collect more resources from them.",
  "Upgrading locations allows you to collect more and better resources from them."
]
const messages = [
  "Keep going!",
  "Good Job!",
  "Keep it up!",
  "Nice!",
  "Let's go!",
  "Awesome!",
  "Great Work!",
  "We got this!"
]
const message = messages[Math.floor(Math.random()*messages.length)];