import React, { useEffect, useState, } from 'react';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { MapEvent, Region, Marker, MarkerProps, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

import { Dimensions } from 'react-native';

interface IPointers extends MarkerProps {
  key: string
}
const windowWidth = Dimensions.get('window').width;
const GOOGLE_MAPS_APIKEY = sua api key;

export default function App() {

  const [location, setLocation] = useState<Region>({
    latitude: -28.665962,
    longitude: -49.405984,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });


  const [point, setPoint] = useState<IPointers | undefined>(undefined)

  useEffect(() => {
    getUserLocation()
  }, []);


  async function getUserLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const responseLocation = await Location.getCurrentPositionAsync({});

    const tempLocation: Region = {
      latitude: responseLocation.coords.latitude,
      longitude: responseLocation.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }

    setLocation(tempLocation)
  }

  function handleSelectAPointInTheMap(event: MapEvent) {

    const newPointer: IPointers = {
      coordinate: {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
      },
      key: new Date().toLocaleString(),
    }

    setPoint(newPointer)
  }

  return (
    <View style={styles.container}>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsPointsOfInterest={true}
        showsUserLocation={true}
        initialRegion={location}
        loadingEnabled={true}
        onPress={(e) => handleSelectAPointInTheMap(e)}

      >
        {
          point &&
          <>
            <Marker
              key={point.key}
              coordinate={point.coordinate}
            >
              <Image
                style={styles.marker}
                source={require('./assets/images/marker.png')}
              />
            </Marker>

            <MapViewDirections
              origin={{
                latitude: location?.latitude ?? 0,
                longitude: location?.longitude ?? 0
              }}
              destination={{
                latitude: Number(point.coordinate.latitude),
                longitude: Number(point.coordinate.longitude)
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="hotpink"

            />
          </>
        }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: "100%",
    height: "100%"
  },
  input: {
    height: 48,
    width: "100%",
    backgroundColor: "#ffff",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 4,
  },
  inputContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 100,
    width: windowWidth,
    padding: 32,
    paddingTop: 48,
    backgroundColor: "#ffff",
  },
  marker: {
    width: 48,
    height: 48,
    resizeMode: 'contain'
  }
});
