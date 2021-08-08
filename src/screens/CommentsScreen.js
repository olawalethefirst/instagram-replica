import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { connect } from 'react-redux';

function CommentsScreen({
    currentUser,
    route: {
        params: {
            post: {
                id,
                user: { uid },
            },
        },
    },
}) {
    const [comments, setComments] = useState([]);
    const [postID, setPostID] = useState('');
    const [comment, setComment] = useState('');

    const onSubmitComment = () => {
        if (currentUser.uid === firebase.auth().currentUser.uid) {
            firebase
                .firestore()
                .collection('posts')
                .doc(uid)
                .collection('userPosts')
                .doc(id)
                .collection('comments')
                .add({
                    creator: firebase.auth().currentUser.uid,
                    text: comment,
                    name: currentUser.name,
                    created: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                    firebase
                        .firestore()
                        .collection('posts')
                        .doc(uid)
                        .collection('userPosts')
                        .doc(id)
                        .collection('comments')
                        .get()
                        .then(
                            (doc) => {
                                let comments = doc.docs.map((doc) => {
                                    const comment = doc.data();
                                    comment.id = doc.id;
                                    return comment;
                                });
                                console.log(comments);
                                comments.sort(
                                    (a, b) =>
                                        a.created.seconds - b.created.seconds
                                );
                                console.log('sorted', comments);

                                setComments(comments);
                            },
                            (e) => console.log(e)
                        );
                });
        } else {
            console.log(currentUser);
        }
    };

    useEffect(() => {
        let unsubscribe;
        if (id !== postID) {
            firebase
                .firestore()
                .collection('posts')
                .doc(uid)
                .collection('userPosts')
                .doc(id)
                .collection('comments')
                .get()
                .then(
                    (doc) => {
                        let comments = doc.docs.map((doc) => {
                            const comment = doc.data();
                            comment.id = doc.id;
                            return comment;
                        });
                        console.log(comments);
                        comments.sort(
                            (a, b) => a.created.seconds - b.created.seconds
                        );
                        console.log('sorted', comments);

                        setComments(comments);
                    },
                    (e) => console.log(e)
                );
            setPostID(id);
        }
    }, [id]);

    return (
        <View>
            <FlatList
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name}</Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View>
                <TextInput
                    value={comment}
                    placeholder="input comment"
                    onChangeText={(text) => setComment(text)}
                />
                <Button onPress={() => onSubmitComment()} title="Send" />
            </View>
        </View>
    );
}

const mapStateToProp = (state) => ({
    currentUser: state.user.currentUser,
});

export default connect(mapStateToProp)(CommentsScreen);
