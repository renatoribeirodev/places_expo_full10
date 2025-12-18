import React from 'react'
import MapView, { LongPressEvent, Marker } from 'react-native-maps'
import { Alert, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    getCurrentPositionAsync,
    LocationObject,
    requestForegroundPermissionsAsync
} from 'expo-location'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import * as placeRepo from '../services/place.repo'
import { Place } from '../models'

export default function MapPage() {

    const navigation = useNavigation<NavigationProp<any>>()

    const [location, setLocation] = React.useState<LocationObject | undefined>(undefined)
    const [places, setPlaces] = React.useState<Place[]>([])

    React.useEffect(() => {
        requestForegroundPermissionsAsync().then(result => {
            if (result.status === 'granted') {
                getCurrentPositionAsync({}).then(myLocation => {
                    setLocation(myLocation)
                })
            } else {
                Alert.alert('Permission to access location was denied')
            }
        })

        navigation.addListener('focus', () => {
            placeRepo.getList().then(places => setPlaces(places))
        })
    }, [])

    function goToCreatePlace(event: LongPressEvent) {
        navigation.navigate('Place', event.nativeEvent.coordinate)
    }

    function goToEditPlace(place: Place) {
        navigation.navigate('Place', place)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 30 }}>
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                zoomControlEnabled={true}
                camera={location && {
                    center: location.coords,
                    heading: 0, pitch: 0, zoom: 15,
                }}
                onLongPress={goToCreatePlace}
            >
                { places.map(place => (
                    <Marker
                        key={place.latitude + '-' + place.longitude}
                        title={place.name}
                        description={place.description}
                        onPress={() => goToEditPlace(place)}
                        coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                    />
                )) }
            </MapView>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
