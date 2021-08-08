import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/app';
import 'firebase/auth';
import LandingScreen from './src/screens/LandingScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import store from './src/redux/store/store';
import { Provider } from 'react-redux';
import MainScreen from './src/screens/MainScreen';
import AddScreen from './src/screens/AddScreen';
import SaveScreen from './src/screens/SaveScreen';
import SignInScreen from './src/screens/SignInScreen';
import CommentsScreen from './src/screens/CommentsScreen';

const firebaseConfig = {
    apiKey: 'AIzaSyAyIoPbBEpJpU6KePNK2W0aZQHfAHtdf_A',
    authDomain: 'instagram-replica-bc4c5.firebaseapp.com',
    projectId: 'instagram-replica-bc4c5',
    storageBucket: 'instagram-replica-bc4c5.appspot.com',
    messagingSenderId: '552692743005',
    appId: '1:552692743005:web:2c475107516026e28286b4',
    measurementId: 'G-BQ4Y4XQ8QQ',
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();
export default function App() {
    const [loaded, setLoaded] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setLoaded(true);
                setLoggedIn(true);
            } else {
                setLoaded(true);
                setLoggedIn(false);
            }
        });
    }, [loggedIn]);

    if (!loaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ alignSelf: 'center' }}>Loading...</Text>
            </View>
        );
    }

    if (!loggedIn) {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Landing">
                    <Stack.Screen
                        name="Landing"
                        component={LandingScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Main">
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="Add" component={AddScreen} />
                    <Stack.Screen name="Save" component={SaveScreen} />
                    <Stack.Screen name="Comments" component={CommentsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
