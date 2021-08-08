import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {
    USER_POSTS_STATE_CHANGE,
    USER_STATE_CHANGE,
    USER_FOLLOWING_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CREATE,
    USERS_POSTS_STATE_UPDATE,
    CLEAR_DATA,
    USER_LIKES_STATE_CHANGE,
    LIKES_COUNT_STATE_CHANGE,
} from '../constants/index';

export function fetchUser() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const user = doc.data();
                    user.uid = doc.id;
                    dispatch({
                        type: USER_STATE_CHANGE,
                        payload: user,
                    });
                } else {
                    console.log('does not exist');
                }
            });
    };
}

export function fetchUserPosts() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        id,
                        ...data,
                    };
                });
                dispatch({
                    type: USER_POSTS_STATE_CHANGE,
                    payload: posts,
                });
            });
    };
}

export function fetchFollowing() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .onSnapshot((doc) => {
                const following = doc.docs.map((doc) => doc.id);
                dispatch({
                    type: USER_FOLLOWING_STATE_CHANGE,
                    payload: following,
                });
                for (let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i]));
                }
            });
    };
}

export function fetchUsersData(uid) {
    return (dispatch, getState) => {
        const found = getState().users.usersData.some(
            (user) => user.uid === uid
        );
        if (found === false) {
            firebase
                .firestore()
                .collection('users')
                .doc(uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const user = doc.data();
                        user.uid = doc.id;
                        dispatch({
                            type: USERS_DATA_STATE_CHANGE,
                            payload: user,
                        });
                        dispatch(fetchUsersFollowingPosts(uid));
                    } else {
                        console.log('user not found');
                    }
                });
        }
    };
}

export function fetchUsersFollowingPosts(uid) {
    return (dispatch, getState) => {
        let firstRunComplete;
        firebase
            .firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .onSnapshot((doc) => {
                const user = getState().users.usersData.find((user) => {
                    return user.uid === uid;
                });
                const posts = doc.docs.map((doc) => {
                    const post = doc.data();
                    post.id = doc.id;
                    return { ...post, user };
                });

                if (firstRunComplete) {
                    dispatch({
                        type: USERS_POSTS_STATE_UPDATE,
                        payload: posts,
                    });
                } else {
                    dispatch({
                        type: USERS_POSTS_STATE_CREATE,
                        payload: posts,
                    });
                    firstRunComplete = true;
                }
                for (let i = 0; i < posts.length; i++) {
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
                }
                for (let i = 0; i < posts.length; i++) {
                    dispatch(fetchPostLikesCount(uid, posts[i].id));
                }
            });
    };
}

export const clearData = {
    type: CLEAR_DATA,
};

export function fetchUsersFollowingLikes(uid, postID) {
    return (dispatch) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postID)
            .collection('likes')
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((doc) => {
                let currentUserLike;
                if (doc.exists) {
                    currentUserLike = true;
                } else {
                    currentUserLike = false;
                }
                const payload = { currentUserLike, postID };
                // console.log(payload);
                dispatch({ type: USER_LIKES_STATE_CHANGE, payload });
            });
    };
}

export function fetchPostLikesCount(uid, postID) {
    return (dispatch) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postID)
            .collection('likes')
            .onSnapshot((doc) => {
                const count = doc.docs.length;
                const payload = { count, postID };
                dispatch({ type: LIKES_COUNT_STATE_CHANGE, payload });
            });
    };
}
