import React from 'react'
import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import * as placeRepo from '../services/place.repo'
import { Place } from '../models'

export default function ListPage() {

    const navigation = useNavigation<NavigationProp<any>>()

    const [places, setPlaces] = React.useState<Place[]>([])

    React.useEffect(() => {
        navigation.addListener('focus', () => {
            placeRepo.getList().then(places => setPlaces(places))
        })
    }, [])

    function goToEditPlace(place: Place) {
        navigation.navigate('Place', place)
    }

    return (
        <View style={styles.container}>
            { places.map(place => (
                <View
                    style={styles.line}
                    key={place.latitude +'-'+ place.longitude}
                    onTouchEnd={() => goToEditPlace(place)}
                >
                    <Text>{place.name}</Text>
                    <Text>{place.description}</Text>
                </View>
            )) }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    line: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
