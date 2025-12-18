import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MapPage from './src/pages/Map'
import ListPage from './src/pages/List'
import PlacePage from './src/pages/Place'

import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MapStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Map" component={MapPage} options={{ headerShown: false }} />
            <Stack.Screen name="Place" component={PlacePage} options={{ title: 'Novo Local' }} />
        </Stack.Navigator>
    )
}

function ListStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="List" component={ListPage} options={{ title: 'Favoritos' }} />
            <Stack.Screen name="Place" component={PlacePage} options={{ title: 'Novo Local' }} />
        </Stack.Navigator>
    )
}

export default function App() {
    return (
        <NavigationContainer>
           <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: '#6200ee',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        position: 'absolute',
                        backgroundColor: '#ffffff',
                        borderTopWidth: 0, 
                        height: 90,
                        paddingBottom: 30,
                        paddingTop: 10,
                    },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Mapa') {
                            iconName = focused ? 'map' : 'map-outline';
                        } else if (route.name === 'Favoritos') { 
                            iconName = focused ? 'heart' : 'heart-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Mapa" component={MapStack} />
                <Tab.Screen name="Favoritos" component={ListStack} /> 
            </Tab.Navigator>
        </NavigationContainer>
    )
}
