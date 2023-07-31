import { view } from "@risingstack/react-easy-state";
import state from "../global"
import pending from "./pending"
import React from 'react';
import {PermissionsAndroid,Alert,Platform} from 'react-native'
import Geolocation from 'react-native-geolocation-service';
import chunkDB, {distanceBetween} from './chunkDB';
import {explore,tryCollectBuildingResources} from './explore'
lastExploredCoordinate = [0,0]

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                      GEOLOCATION STUFF
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DO IOS LOCATION PERMISSIONS
hasLocationPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
      '',
      [
        { text: 'Go to Settings', onPress: openSetting },
        { text: "Don't Use Location", onPress: () => {} },
      ],
    );
  }

  return false;
};

// CHECK IF WE HAVE LOCATION PERMISSION
hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasLocationPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show(
      'Location permission denied by user.',
      ToastAndroid.LONG,
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};


getLocationUpdates = async () => {
  const hasLocationPermission2 = await hasLocationPermission();

  if (!hasLocationPermission2) {
    return;
  }

  
  watchId = Geolocation.watchPosition(
    async (pos) => {
      // if far enough away from last explored place, explore this place
      // update location in state
      await chunkDB.setLocationChunk(pos.coords.latitude,pos.coords.longitude);
      let distancebetween = distanceBetween(lastExploredCoordinate[0],lastExploredCoordinate[1],pos.coords.latitude,pos.coords.longitude)
      if(distancebetween > 20){
        // "explore" the new area, getting a new lastExploredCoordinate that you have to move past before that function
        // runs again.
        newExploredCoordinate = explore(pos.coords.latitude,pos.coords.longitude);
        if(distancebetween > 40 && distancebetween < 80){
          // also "explore" the average of the two if between 40 and 80 m, so we don't have massive gaps between the green areas - as GPS dont update as often as we'd like
          explore((pos.coords.latitude+lastExploredCoordinate[0])/2,(pos.coords.longitude+lastExploredCoordinate[1])/2)
        }
        
        
        // get the new closest structure into state.
        if(chunkDB.updatenearbyBuilding(pos.coords.latitude,pos.coords.longitude)){
          // try complete any pending items now that you are nearby a different building
          pending.tryCompleteAny();
          // check if this building will let you collect any resources from it - if so, collect them
          tryCollectBuildingResources();

        }
        lastExploredCoordinate = newExploredCoordinate;
      } 
      state.location.lat = pos.coords.latitude;
      state.location.lng = pos.coords.longitude;
    },
    (error) => {
      alert( error);
      //console.warn(error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 3000,
      fastestInterval: 2000,
      forceRequestLocation: true,
      showLocationDialog: true,
      useSignificantChanges: false,
    },
  );
};







export default Locator = view((props)=>{
  
    // on component mounted, get location set up
  React.useEffect(() => {
    getLocationUpdates()
  }, []);
  
})