import React from 'react';
import state from '../global'
import Realm from 'realm';

function chunkTemplate(chunkKey){
    return {
        explored:[],
        buildings:[],
        key:chunkKey,
    }
}
const ExploredSchema = {
    name: 'Explored',
    properties: {
      lat:  'float',
      lng: 'float',
    }
};
const BuildingSchema = {
    name:'Building',
    properties:{
        lat:'float',
        lng:'float',
        name:'string',
        lastCollected:'int'
    }
}
const ChunkSchema = {
    name: 'Chunk',
    primaryKey:'key',
    properties: {
      key:     'string',
      buildings: 'Building[]',
      explored: 'Explored[]',
    }
};


function locationToChunk(val){
    return Math.floor(val *100);
}
function getKeyFromChunk(x,y){
    return x + "," + y;
}
// chunk database: stores "chunks" of information about a set of coordinates, including the places in that chunk
// the player has travelled to, the buildings the player has found or built there, etc.
// this file has methods about exploring and modifying buildings.
/**
 * chunkDB document format:
 * _id: lat*100,lng*100,
 * explored:[]// array of coordinates
 * buildings:[]// coordinate, name
 */
var realm = null;
Realm.open({schema: [ChunkSchema, ExploredSchema,BuildingSchema]}).then(rlm => {
    realm = rlm
});
class DBLoader extends React.Component {// responsible for loading and unloading the database - should only be mounted once 
    
    componentWillUnmount() {
        // Close the realm if there is one open.
        if (realm !== null && !realm.isClosed) {
            realm.close();
        }
    }  
    render(){return null;} 
}

export {DBLoader};
export default chunkDB = {
    getKeyFromLocation(lat,lng){
        x = locationToChunk(lat);
        y = locationToChunk(lng);
        return getKeyFromChunk(x,y)
    },
    async getChunk(key){
        if(realm == null){
            realm = await Realm.open({schema: [ChunkSchema, ExploredSchema,BuildingSchema]}); 
        }
        
        let chunks = realm.objects('Chunk');
        let chunk = chunks.filtered('key = "' + key + '"')
        // doc is the chunk or null
        if(chunk.length == 0){
            return undefined
        }
        //return chunk[0];
        let res = chunkTemplate(key)
        for(var i of chunk[0].explored){
            res.explored.push({lat:i.lat,lng:i.lng})
        }
        for(var i of chunk[0].buildings){
            res.buildings.push({lat:i.lat,lng:i.lng,name:i.name,lastCollected:i.lastCollected})
        }
        return res;
    },
    async modifyLocationChunk(fn){
        if (realm == null || realm.isClosed) return; 
        realm.write(()=>{
            fn()
            realm.create('Chunk', state.locationChunk, 'modified');// store state.locationchunk back into memory
        })
    },
    async setLocationChunk(lat,lng){
        var key = this.getKeyFromLocation(lat,lng)
        if(state.locationChunk.key == key) return;
        if(state.chunks[key] != undefined) {
            state.locationChunk = state.chunks[key]
            return;
        }
        chunk = await this.getChunk(key);
        if(chunk == undefined) chunk = chunkTemplate(key)
        state.locationChunk = chunk;
        return;
    },
    addBuilding(lat,lng,building){
        var key = this.getKeyFromLocation(lat,lng)
        // add to state if chunk in state
        if(key != state.locationChunk.key) console.error("ERROR globaljs addbuilding, only allowed to store stuff in location chunk'")
        this.modifyLocationChunk(()=>{
            state.locationChunk.buildings.push(building)
        })
    },
    
    prevChunkZone:{x:0,y:0,x2:0,y2:0},
    updatenearbyBuilding(lat,lng){
        // run after explore() is run, to update what building you are nearest too.
        // returns true if a building is found so we can check if any pending requests need to be processed.
        for(var building of state.locationChunk.buildings){
            if(distanceBetween(lat,lng,building.lat,building.lng) < 25){
                // something too close, let's not do this!
                // return that place that's too close, so we can check that we are further away than that
                // before trying to add again.
                state.nearbyBuilding = building;
                return true;
            }
        }
        // otherwise, set nearbyBuilding to null to signify no structure there
        state.nearbyBuilding = null;
        return false;
    },
    
    async getChunks(lat,lng,lat2,lng2){
        var tmp;
        if(lat2 < lat){// lat should always be smallest
            tmp = lat;lat = lat2;lat2 = tmp;
        }
        if(lng2 < lng){// same for lng
            tmp = lng;lng = lng2; lng2 = tmp;
        }
        // convert lat, lng, to chunk coordinates
        var x = locationToChunk(lat)-1;
        var y = locationToChunk(lng)-1;
        var x2 = locationToChunk(lat2)+1;
        var y2 = locationToChunk(lng2)+1;
        // get chunks around a certain area, into state.
        if((lat-lat2) > 10){
            // maximum of 9 chunks by 9 chunks rendered
            var midlat = Math.floor((lat+lat2)/2);
            var midlng = Math.floor((lng + lng2)/2);
            lat = midlat - 4;
            lng = midlng - 4;
            lat2 = midlat + 4;
            lng2 = midlng + 4;
        }
        // if the previous chunks are the same as the chunks right now, dont do anything
        if(this.prevChunkZone.x == x && this.prevChunkZone.y == y && this.prevChunkZone.x2 == x2 && this.prevChunkZone.y2 == y2){
            return;
        }
        this.prevChunkZone.x = x;
        this.prevChunkZone.y = y;
        this.prevChunkZone.x2 = x2;
        this.prevChunkZone.y2 = y2
        //get chunks from database or previous chunks in state
        let newChunks = {};
        
        // iterate through chunks
        for(var i = x; i <= x2; i++){
            for(var j = y; j <= y2;j++){
                var key = getKeyFromChunk(i,j);
                if(state.chunks[key] == undefined){
                    if(state.locationChunk.key == key)
                        newChunks[key] = state.locationChunk;
                    else{
                        let newChunk = await this.getChunk(key);
                        if(newChunk != undefined)
                        newChunks[key] = newChunk;
                    }
                        
                } else
                    newChunks[key] = state.chunks[key];
            }
        }
        state.chunks = newChunks;
    }
}

function distanceBetween(lat1, lng1, lat2, lng2){
    var earthRadiusM = 6378100;
    var dLat = (lat2-lat1)* (Math.PI/180);
    var dLng = (lng2-lng1)* (Math.PI/180);

    lat1 = (lat1)* (Math.PI/180);
    lat2 = (lat2)* (Math.PI/180);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusM * c;
}
export {distanceBetween}