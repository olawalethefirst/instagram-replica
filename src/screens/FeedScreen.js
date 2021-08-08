import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

function FeedScreen({ usersLoaded, following, currentUser, feed, navigation }) {
    const [posts, setPosts] = useState([]);

    const onLikePress = (uid, postID) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postID)
            .collection('likes')
            .doc(firebase.auth().currentUser.uid)
            .set({});
    };
    const onUnLikePress = (uid, postID) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postID)
            .collection('likes')
            .doc(firebase.auth().currentUser.uid)
            .delete();
    };

    useEffect(() => {
        if (usersLoaded === following.length && following.length !== 0) {
            feed.sort((x, y) => {
                return -x.creation + y.creation;
            });
            setPosts(feed);
        }
        console.log(feed);
    }, [usersLoaded, feed]);
    return (
        <View style={styles.container}>
            <View style={styles.galleryContainer}>
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={posts}
                    renderItem={({ item }) => (
                        <View style={styles.postContainer}>
                            <Text>{item.user.name}</Text>

                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            <Text>Likes: {item.likesCount}</Text>
                            {!item.currentUserLike ? (
                                <Button
                                    title="Like"
                                    onPress={() =>
                                        onLikePress(item.user.uid, item.id)
                                    }
                                />
                            ) : (
                                <Button
                                    title="Un-Like"
                                    onPress={() =>
                                        onUnLikePress(item.user.uid, item.id)
                                    }
                                />
                            )}

                            <Text
                                onPress={() =>
                                    navigation.navigate('Comments', {
                                        post: item,
                                    })
                                }
                            >
                                View Comments...
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.user.currentUser,
        following: state.user.following,
        feed: state.users.feed,
        usersLoaded: state.users.usersLoaded,
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    galleryContainer: {
        flex: 1,
    },
    postContainer: {
        flex: 1,
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1,
    },
});

export default connect(mapStateToProps)(FeedScreen);
