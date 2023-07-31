import { store } from '@risingstack/react-easy-state';


export default state = store({ 
    inventory: {},// stores items you have (not pending items)
    pending:[],
    location:{lat:0,lng:0},
    chunks:{},// stores chunks on screen. These chunks should not be edited
    locationChunk:{},// stores chunk for your current location. This chunk could be edited
    nearbyBuilding:null,//stores the information of the nearby structure (from locationChunk)
    exp:0,
    tierReached:1,
});
