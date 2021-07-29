import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { fetchUserPosts } from '../redux/actions/index';
import Constants from 'expo-constants';
import firebase from 'firebase/app';

function ProfileScreen({
    route: {
        params: { uid },
    },
    currentUser,
    posts,
    fetchUserPosts,
}) {
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [following, setFollowing] = useState(null);

    const onFollow = () => {
        firebase
            .firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .doc(uid)
            .set({})
            .then(() => setFollowing(true));
    };
    const onUnFollow = () => {
        firebase
            .firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .doc(uid)
            .delete()
            .then(() => setFollowing(false));
    };
    const updateFollowing = () => {
        firebase
            .firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .doc(uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setFollowing(true);
                } else {
                    setFollowing(false);
                }
            });
    };
    useEffect(() => {
        if (uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserPosts(posts);
        } else {
            firebase
                .firestore()
                .collection('users')
                .doc(uid)
                .get()
                .then((doc) => {
                    setUser(doc.data());
                });
            firebase
                .firestore()
                .collection('posts')
                .doc(uid)
                .collection('userPosts')
                .orderBy('creation', 'asc')
                .onSnapshot((doc) => {
                    const posts = doc.docs.map((doc) => {
                        const id = doc.id;
                        const data = doc.data();
                        return {
                            id,
                            ...data,
                        };
                    });
                    setUserPosts(posts);
                });
        }
        updateFollowing();
    }, [uid]);

    if (!user) {
        return <View />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
                {uid !== firebase.auth().currentUser.uid &&
                    (following === null ? (
                        <TouchableOpacity style={{ backgroundColor: 'grey' }}>
                            <Text>Loading</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{ backgroundColor: 'grey' }}
                            onPress={following ? onUnFollow : onFollow}
                        >
                            <Text>{following ? 'Following' : 'Follow'}</Text>
                        </TouchableOpacity>
                    ))}
            </View>
            <View style={styles.galleryContainer}>
                <FlatList
                    numColumns={3}
                    data={userPosts}
                    keyExtractor={(item) => item.ID + item.downloadURL}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.postsContainer}>
                                <Image
                                    style={styles.posts}
                                    source={{
                                        uri: item.downloadURL,
                                    }}
                                />
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    posts: state.user.posts,
});

const mapDispatchToProps = (dispatch) => ({
    fetchUserPosts: () => dispatch(fetchUserPosts),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Constants.statusBarHeight,
    },
    infoContainer: {
        margin: 20,
    },
    galleryContainer: {
        flex: 1,
    },
    postsContainer: {
        flex: 1 / 3,
    },
    posts: {
        flex: 1,
        aspectRatio: 1 / 1,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
