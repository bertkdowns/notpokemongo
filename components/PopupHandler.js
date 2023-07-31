import * as React from "react"
import { View, Text} from 'react-native';
import { view } from "@risingstack/react-easy-state";
import { Overlay } from "react-native-elements";

const reducer = (state,action)=>{
    if(action.type == "push"){
        state.push(action.item)
        return [...state];
    } else if (action.type == "pop"){
        state.pop();
        return [...state];
    } else console.warn("PopupHandler invalid type!!!")
    return state;
}
const addPopup = (item) =>{
    globalUpdatePopups({
        type:"push",
        item:item,
    })
};
const closePopup = () =>{
    globalUpdatePopups({type:"pop"})
}
var topItem;
const getTopItem = () =>{
    return topItem;
}
const initialState = [];
// global access to the popupHandler reducer
var globalUpdatePopups = ()=>{};
const PopupHandler = view( ()=>{
    const [popups,updatePopups] = React.useReducer(reducer,initialState);
    // THERE MUST BE ONLY 1 PopupHandler IN THE APP, as has a global variable globalupdatePopups to update the sate
    globalUpdatePopups = updatePopups;
   topItem = popups.length != 0 ? popups[popups.length -1] : undefined;
    
    if(popups.length == 0 ) {
        return <Overlay isVisible={false}><Text>Hello!</Text></Overlay>
    } 
    // display the popup on the top of the stack
    return (<Overlay
    //animationType="fade"
    overlayStyle={{justifyContent:"center",alignItems:"center",minWidth:300,margin:10}}
    isVisible={true}
    onRequestClose={() => {updatePopups({type:"pop"})}} // remove popup if the user requests to close it
    >
            {popups[popups.length-1]}
            
    </Overlay>)
    
    
})

export {PopupHandler,addPopup,closePopup, getTopItem}