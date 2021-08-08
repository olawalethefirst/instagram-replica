import React, { useReducer, useState } from 'react';
import { TextInput, View, Button, Text } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/auth';

export default function SignInScreen() {
    const [error, setError] = useState('');

    //Action Types
    const UPDATE_EMAIL = 'UPDATE_EMAIL';
    const UPDATE_PASSWORD = 'UPDATE_PASSWORD';

    //Reducer
    const reducer = (state, action) => {
        switch (action.type) {
            case UPDATE_EMAIL:
                return { ...state, email: action.payload };
            case UPDATE_PASSWORD:
                return { ...state, password: action.payload };
            default:
                return state;
        }
    };
    //State
    const [state, dispatch] = useReducer(reducer, {
        email: '',
        password: '',
    });

    //Dispatcher generator
    const updateField = (type, value) => {
        switch (type) {
            case 'email':
                return dispatch({
                    type: UPDATE_EMAIL,
                    payload: value,
                });
            case 'password':
                return dispatch({
                    type: UPDATE_PASSWORD,
                    payload: value,
                });
            default:
                return;
        }
    };

    const onSignIn = () => {
        const { name, email, password } = state;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result);
            })
            .catch((err) => setError(err.message));
    };

    return (
        <View>
            <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Email"
                value={state.email}
                onChangeText={(text) => updateField('email', text)}
            />
            <TextInput
                secureTextEntry
                placeholder="Password"
                value={state.password}
                onChangeText={(text) => updateField('password', text)}
            />
            {error ? <Text>{'Error: ' + error}</Text> : null}
            <Button title="Sign In" onPress={() => onSignIn()} />
        </View>
    );
}
