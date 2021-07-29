import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';
import firebase from 'firebase/app';

export default function SaveScreen({
    navigation,
    route: {
        params: { image },
    },
}) {
    console.log(image);
    const [caption, setCaption] = useState('');

    const uploadPost = async () => {
        const response = await fetch(image);
        const blob = await response.blob();
        const childPath = `post/${
            firebase.auth().currentUser.uid
        }/${Math.random().toString(36)}`;
        const savePostData = (downloadURL) => {
            firebase
                .firestore()
                .collection('posts')
                .doc(firebase.auth().currentUser.uid)
                .collection('userPosts')
                .add({
                    downloadURL,
                    caption,
                    creation: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(function () {
                    navigation.popToTop();
                });
        };

        const task = firebase.storage().ref().child(childPath).put(blob);
        const taskProgress = (snapshot) =>
            console.log(`transferred: ${snapshot.bytesTransferred}`);
        const taskCompleted = () =>
            task.snapshot.ref.getDownloadURL().then((downloadURL) => {
                savePostData(downloadURL);
                console.log(downloadURL);
            });
        const taskError = (snapshot) => console.log(snapshot);

        task.on('state_changed', taskProgress, taskError, taskCompleted);
    };

    return (
        <View>
            <Image source={{ uri: image }} />
            <TextInput
                placeholder="Input a caption..."
                value={caption}
                onChangeText={(text) => setCaption(text)}
            />
            <TouchableOpacity onPress={() => uploadPost()}>
                <Text>Save Post</Text>
            </TouchableOpacity>
        </View>
    );
}
