import firebase from 'firebase/app';
import {
    USER_POSTS_STATE_CHANGE,
    USER_STATE_CHANGE,
    USER_FOLLOWING_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    INCREASE_COUNT,
} from '../constants/index';

export function fetchUser() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({
                        type: USER_STATE_CHANGE,
                        payload: snapshot.data(),
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
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .snapshot((doc) => {
                const following = doc.docs.map((doc) => doc.id);
                dispatch({
                    type: USER_FOLLOWING_STATE_CHANGE,
                    payload: following,
                });
                for (uid in following) {
                    dispatch(fetchUsersData(uid));
                }
            });
    };
}

export function fetchUsersData(uid) {
    return (dispatch, getState) => {
        const found = getState().users.usersData.some(
            (user) => user.id === uid
        );
        if (found === false) {
            firebase
                .firestore()
                .collection('posts')
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
                        dispatch();
                    } else {
                        console.log('user not found');
                    }
                });
        }
    };
}

export function fetchUsersFollowingPosts(id) {
    return (dispatch, getState) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(uid)
            .collection('usePosts')
            .orderBy('creation', 'asc')
            .onSnapshot((doc) => {
                console.log(id === doc.query.EP.path.segments[1]);
                const uid = doc.query.EP.path.segments[1];
                const user = getState().users.usersData.find(
                    (user) => user.uid === uid
                );
                const posts = doc.docs.map((doc) => {
                    const post = doc.data();
                    post.id = doc.id;
                    return { ...post, user };
                });
                const payload = { posts, uid };
                getState().users.usersData.find((user) => {
                    if (user.uid === uid && !user.posts) {
                        dispatch(updateLoadedCount);
                    }
                });
                dispatch({
                    type: USERS_POSTS_STATE_CHANGE,
                    payload,
                });
            });
    };
}

export const updateLoadedCount = {
    type: INCREASE_COUNT,
};
