import React, { useReducer } from 'react';
import { TextInput, View, Button } from 'react-native';
import firebase from 'firebase';

export default function LoginScreen() {
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
        const { email, password } = state;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((result) => console.log(result))
            .catch((err) => console.log(err));
    };

    return (
        <View>
            <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Email"
                onChangeText={(text) => updateField('email', text)}
            />
            <TextInput
                secureTextEntry
                placeholder="Password"
                onChangeText={(text) => updateField('password', text)}
            />
            <Button title="Sign In" onPress={() => onSignIn()} />
        </View>
    );
}
