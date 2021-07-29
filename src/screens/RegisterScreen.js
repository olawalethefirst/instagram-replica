import React, { useReducer } from 'react';
import { TextInput, View, Button } from 'react-native';
import firebase from 'firebase';

export default function RegisterScreen() {
    //Action Types
    const UPDATE_EMAIL = 'UPDATE_EMAIL';
    const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
    const UPDATE_NAME = 'UPDATE_NAME';

    //Reducer
    const reducer = (state, action) => {
        switch (action.type) {
            case UPDATE_EMAIL:
                return { ...state, email: action.payload };
            case UPDATE_PASSWORD:
                return { ...state, password: action.payload };
            case UPDATE_NAME:
                return { ...state, name: action.payload };
            default:
                return state;
        }
    };
    //State
    const [state, dispatch] = useReducer(reducer, {
        email: '',
        password: '',
        name: '',
    });

    //Dispatcher generator
    const updateField = (type, value) => {
        switch (type) {
            case 'name':
                return dispatch({
                    type: UPDATE_NAME,
                    payload: value,
                });
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

    const onSignUp = () => {
        const { name, email, password } = state;
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase
                    .firestore()
                    .collection('users')
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        email,
                    });
                console.log(result);
            })
            .catch((err) => console.log(err));
    };

    return (
        <View>
            <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Name"
                value={state.name}
                onChangeText={(text) => updateField('name', text)}
            />
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
            <Button title="Sign Up" onPress={() => onSignUp()} />
        </View>
    );
}
